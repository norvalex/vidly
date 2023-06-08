const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const { default: mongoose } = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const _id = new mongoose.Types.ObjectId().toHexString();
    const user = { _id, isAdmin: true };
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user).toHaveProperty("_id", _id);
    expect(req.user).toHaveProperty("isAdmin", true);
    expect(req.user).toMatchObject(user);
  });
});
