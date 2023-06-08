const express = require("express");
const { Person, personValidation } = require("../models/person");

const router = express.Router();

router.get("/", async (req, res) => {
  const tenants = await Person.find().sort("name");

  res.send(tenants);
});

router.get("/:id", async (req, res) => {
  const tenant = await Person.findById(req.params.id);
  if (!tenant) return res.status(400).send("Tenant not found");

  res.send(tenant);
});

router.post("/", async (req, res) => {
  // TODO Authenticate user is logged in
  const { error } = personValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tenant = new Person({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
  });
  await tenant.save();

  // TODO: Handle error when trying to POST a duplicate name

  res.send(tenant);
});

router.put("/:id", async (req, res) => {
  // TODO Authenticate user is logged in
  const { error } = personValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: what happens if only one parameter is provided
  let tenant = await Person.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!tenant) return res.status(400).send("Tenant not found");
  // TODO: Handle error when trying to PUT a duplicate name
  res.send(tenant);
});

router.delete("/:id", async (req, res) => {
  // TODO Authenticate user is logged in
  // Verify user is admin
  const tenant = await Person.findByIdAndDelete(req.params.id);

  if (!tenant) return res.status(400).send("Tenant not found");

  res.send(tenant);
});

module.exports = router;
