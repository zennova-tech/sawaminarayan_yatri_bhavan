import Joi from 'joi';

export const checkInDateSchema = Joi.object({
  checkInDate: Joi.date()
    .iso()
    .messages({
      'date.base': `"checkInDate" must be a valid date`,
      'date.format': `"checkInDate" must be in valid format`,
    })
    .optional(),
  status: Joi.string().optional(),
});

export const deleteBookingSchema = Joi.object({
  id: Joi.string().required(),
});

export const bookingSchema = Joi.object({
  check_out: Joi.string().required(),
  check_in: Joi.string().required(),
  rooms: Joi.number().required(),
  total_guests: Joi.number().optional(),
  mattress: Joi.number().optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().optional(),
  phone_number: Joi.number().required(),
  email: Joi.string().required(),
  address1: Joi.string().optional().allow(''),
  address2: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  state: Joi.string().optional().allow(''),
  amount: Joi.number().required(),
  agree: Joi.boolean().optional(),
  amount_paid: Joi.number().optional(),
  amount_due: Joi.number().optional(),
  payment_status: Joi.string().optional(),
  remarks: Joi.string().optional().allow(''),
});

export const roomRuleSchema = Joi.object({
  name: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  price_per_night: Joi.number().required(),
  is_default_price: Joi.boolean().optional(),
});

export const deleteRoomRuleSchema = Joi.object({
  id: Joi.string().required(),
});

export const calculatePriceSchema = Joi.object({
  check_in: Joi.string().required(),
  check_out: Joi.string().required(),
  total_rooms: Joi.number().required(),
});

export const cancelBookingSchema = Joi.object({
  id: Joi.string().required(),
});

export const getUsersSchema = Joi.object({
  search: Joi.string().optional(),
});
