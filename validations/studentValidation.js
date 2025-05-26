import Joi from 'joi';

// Common validation rules
const nameSchema = Joi.string()
  .min(2)
  .max(100)
  .trim()
  .required()
  .messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 100 characters'
  });

const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } })
  .lowercase()
  .trim()
  .required()
  .messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  });

const ageSchema = Joi.number()
  .integer()
  .min(16)
  .max(100)
  .required()
  .messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age must be at least 16',
    'number.max': 'Age must be 100 or less',
    'any.required': 'Age is required'
  });

const courseSchema = Joi.string()
  .trim()
  .max(100)
  .required()
  .messages({
    'string.empty': 'Course name is required',
    'string.max': 'Course name cannot be longer than 100 characters'
  });

// Validation schema for creating a student
export const createStudentSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  age: ageSchema,
  courseEnrolled: courseSchema
});

// Validation schema for updating a student
export const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } }).lowercase().trim(),
  age: Joi.number().integer().min(16).max(100),
  courseEnrolled: Joi.string().trim().max(100)
}).min(1);

export default {
  createStudentSchema,
  updateStudentSchema
};
