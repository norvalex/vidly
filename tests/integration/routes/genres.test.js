const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const { default: mongoose } = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.collection.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if genre not found", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with given id", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });

    it("should return the genre if valid id is passed", async () => {
      const genre = await new Genre({ name: "genre1" });
      genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the
    // test
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return status 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return status 400 if genre is less than 5 chars", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return status 400 if genre is more than 50 chars", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /id", () => {
    let token;
    let newName;
    let id;
    let genre;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set({ "x-auth-token": token })
        .send({ name: newName });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      newName = "genreUpdated";

      genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id.toHexString();
    });

    it("should return a 401 if user not logged in", async () => {
      token = "";

      const result = await exec();

      expect(result.status).toBe(401);
    });

    it("should return a 400 if name is less than 5 chars", async () => {
      newName = "1234";

      const result = await exec();

      expect(result.status).toBe(400);
    });

    it("should return a 400 if name is more than 50 chars", async () => {
      newName = new Array(52).join("a");

      const result = await exec();

      expect(result.status).toBe(400);
    });

    it("should return a 404 if id is invalid", async () => {
      id = 1;

      const result = await exec();

      expect(result.status).toBe(404);
    });

    it("should return a 404 if id is valid but not found", async () => {
      id = new mongoose.Types.ObjectId();

      const result = await exec();

      expect(result.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await Genre.findById(id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /id", () => {
    let token;
    let id;
    let genre;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set({ "x-auth-token": token });
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id.toHexString();
    });

    it("should return a 404 if id is invalid", async () => {
      id = 1;

      const result = await exec();

      expect(result.status).toBe(404);
    });

    it("should return a 401 if user not logged in", async () => {
      token = "";

      const result = await exec();

      expect(result.status).toBe(401);
    });

    it("should return a 403 if user is not an admin", async () => {
      token = new User().generateAuthToken();

      const result = await exec();

      expect(result.status).toBe(403);
    });

    it("should return a 404 if id is valid but not found", async () => {
      id = new mongoose.Types.ObjectId();

      const result = await exec();

      expect(result.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", id);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
