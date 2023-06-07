const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { Customer } = require("../../../models/customer");
const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const { default: mongoose } = require("mongoose");
const moment = require("moment");

let server;

describe("/api/returns", () => {
  beforeEach(async () => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await Rental.collection.deleteMany({});
    await Movie.collection.deleteMany({});
  });

  describe("POST /customerId, movieId", () => {
    let rental;
    let token;
    let customerId;
    let movieId;
    let movie;

    const exec = () => {
      return request(server)
        .post("/api/returns")
        .set("x-auth-token", token)
        .send({ customerId, movieId });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      customerId = new mongoose.Types.ObjectId();
      movieId = new mongoose.Types.ObjectId();

      rental = new Rental({
        customer: {
          _id: customerId,
          name: "12345",
          phone: "12345",
        },
        movie: {
          _id: movieId,
          title: "12345",
          dailyRentalRate: 2,
        },
      });
      await rental.save();

      movie = new Movie({
        _id: movieId,
        title: "12345",
        genre: {
          name: "genre1",
        },
        numberInStock: 10,
        dailyRentalRate: 2,
      });
      await movie.save();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if clientId not provided", async () => {
      customerId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if movieId not provided", async () => {
      movieId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if rental not found", async () => {
      customerId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if return already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 200 if rental successfully processed", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should set the return date if input is valid", async () => {
      await exec();

      const rentalInDb = await Rental.findById(rental._id);
      const diff = new Date() - rentalInDb.dateReturned;

      expect(diff).toBeLessThan(10 * 1000);
      expect(rentalInDb.dateReturned).toBeDefined();
    });

    it("should set rental fee if input is valid", async () => {
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();

      await exec();

      const rentalInDb = await Rental.findById(rental._id);

      expect(rentalInDb.rentalFee).toBe(rental.movie.dailyRentalRate * 7);
    });

    it("should increase movie stock if input is valid", async () => {
      await exec();

      const movieInDb = await Movie.findById(movieId);

      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental if input is valid", async () => {
      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "dateOut",
          "dateReturned",
          "rentalFee",
          "customer",
          "movie",
        ])
      );
    });
  });
});
