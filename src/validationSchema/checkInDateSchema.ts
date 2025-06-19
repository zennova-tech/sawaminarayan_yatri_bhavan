import Joi from 'joi';

export const checkInDateSchema = Joi.object({
  checkInDate: Joi.date()
    .iso()
    .messages({
      'date.base': `"checkInDate" must be a valid date`,
      'date.format': `"checkInDate" must be in valid format`,
    })
    .optional(),
});

export const deleteBookingSchema = Joi.object({
  id: Joi.string().required(),
});
