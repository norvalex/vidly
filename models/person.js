const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const personSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  phone: {
    type: String,
    minLength: 3,
    maxLength: 15,
  },
});

// Model
const Person = mongoose.model("Person", personSchema);

// Validation
function personValidation(person) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).email().required(),
    phone: Joi.string().min(3).max(15),
  });
  return schema.validate(person);
}

module.exports.Person = Person;
module.exports.personValidation = personValidation;
module.exports.personSchema = personSchema;
