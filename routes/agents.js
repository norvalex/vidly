const express = require("express");
const { Entity, entityValidation } = require("../models/entity");
const { Person } = require("../models/person");

const router = express.Router();

router.get("/", async (req, res) => {
  const agents = await Entity.find().sort("name");

  res.send(agents);
});

router.get("/:id", async (req, res) => {
  const agent = await Entity.findById(req.params.id);
  if (!agent) return res.status(400).send("Agent not found");

  res.send(agent);
});

router.post("/", async (req, res) => {
  // TODO Authenticate user is logged in
  const { error } = entityValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const contactPerson = await Person.findById(req.body.contactPersonId);
  if (!contactPerson) return res.status(400).send("Contact person not found");

  console.log(contactPerson);

  const agent = new Entity({
    name: req.body.name,
    contactPerson: {
      _id: contactPerson._id.toString(),
      firstName: contactPerson.firstName,
      lastName: contactPerson.lastName,
      email: contactPerson.email,
      phone: contactPerson.phone,
    },
  });
  await agent.save();

  // TODO: Handle error when trying to POST a duplicate name

  res.send(agent);
});

router.put("/:id", async (req, res) => {
  // TODO Authenticate user is logged in
  const { error } = entityValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const contactPerson = await Person.findById(req.body.contactId);
  if (!contactPerson) return res.status(400).send("Contact person not found");

  // TODO: what happens if only one parameter is provided
  const agent = await Entity.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    constactPerson: {
      _id: contactPerson._id,
      firstName: contactPerson.firstName,
      lastName: contactPerson.lastName,
      email: contactPerson.email,
      phone: contactPerson.phone,
    },
  });

  if (!agent) return res.status(400).send("Agent not found");
  // TODO: Handle error when trying to PUT a duplicate name
  res.send(agent);
});

router.delete("/:id", async (req, res) => {
  // TODO Authenticate user is logged in
  // Verify user is admin
  const agent = await Entity.findByIdAndDelete(req.params.id);

  if (!agent) return res.status(400).send("Agent not found");

  res.send(agent);
});

module.exports = router;
