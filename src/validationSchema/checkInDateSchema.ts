import Joi from "joi";

export const checkInDateSchema = Joi.object({
  checkInDate: Joi.date()
    .iso()
    .messages({
      "date.base": `"checkInDate" must be a valid date`,
      "date.format": `"checkInDate" must be in valid format`,
    })
    .optional(),
});

export const deleteBookingSchema = Joi.object({
  id: Joi.string().required(),
});

export const bookingSchema = Joi.object({
  check_out: Joi.string().required(),
  check_in: Joi.string().required(),
  rooms: Joi.number().required(),
  guest_per_room: Joi.number().required(),
  mattress: Joi.number().optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().optional(),
  phone_number: Joi.number().required(),
  email: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  amount: Joi.number().required(),
});

export const roomRuleSchema = Joi.object({
  name: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.number().required(),
  price_per_night: Joi.number().required(),
  is_default_price: Joi.boolean().optional(),
});

export const deleteRoomRuleSchema = Joi.object({
  id: Joi.string().required(),
});