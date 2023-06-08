const mongoose = require("mongoose");
const Joi = require("joi");
const { personSchema } = require('./person')

// Schema
const entitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  contactPerson: {
    type: personSchema,
    required: true,
  },
  address: {
    type: String,
    minLength: 3,
    maxLength: 255,
  },
  logoImage: {
    type: String
  }
});

// Model
const Entity = mongoose.model("Entity", entitySchema);

// Validation
function entityValidation(entity) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    contactPersonId: Joi.string().required(),
  });
  return schema.validate(entity);
}

module.exports.Entity = Entity;
module.exports.entityValidation = entityValidation;
