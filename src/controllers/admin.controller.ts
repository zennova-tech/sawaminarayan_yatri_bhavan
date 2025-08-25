import { bookingPayload } from '@/interfaces/types/bookingInterfaces';
import {
  BookingRooms,
  cancelBookingData,
  deleteBookingData,
  fetchBookingsData,
} from '@/repository/booking.repository';
import {
  createPriceRule,
  deletePriceRuleData,
  fetchDefaultPriceRule,
  fetchPriceRuleData,
  findOverlappingDateRule,
  findPriceRuleByDate,
  findPriceRuleByName,
  updatePriceRuleData,
} from '@/repository/priceRules.repository';
import Booking from '@/sequilizedir/models/booking.model';
import { IRoomPriceRules } from '@/sequilizedir/models/roomPriceRules.model';
import { generalResponse } from '@/utils/generalResponse';
import { eachDayOfInterval, parseISO, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Request, Response } from 'express';

const AdminDashboard = async (req: Request, res: Response) => {
  const { checkInDate, status } = req.query;
  try {
    const bookings: Booking[] | null = await fetchBookingsData(
      checkInDate as string,
      status as string,
    );
    return generalResponse(req, res, bookings, 'Booking List fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to fetch booking list', false, 'error', 500);
  }
};

const DeleteBooking = async (req: Request, res: Response) => {
  try {
    const data = await deleteBookingData(String(req.query.id));
    return generalResponse(req, res, data, 'Booking deleted successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to delete booking', false, 'error', 500);
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      check_in,
      check_out,
      rooms,
      total_guests,
      mattress,
      amount,
      first_name,
      last_name,
      phone_number,
      email,
      address1,
      address2,
      city,
      state,
      payment_status,
      amount_paid,
      amount_due,
      remarks,
    } = req.body;
    const notes: bookingPayload = {
      check_in,
      check_out,
      rooms,
      total_guests,
      mattress,
      amount,
      first_name,
      last_name,
      phone_number,
      email,
      address1,
      address2,
      city,
      state,
      payment_status,
      amount_paid,
      amount_due,
      remarks,
    };
    const bookingData = await BookingRooms(notes, req.transaction);
    return generalResponse(req, res, bookingData, 'Booking created successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to create booking', false, 'error', 500);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const {
      check_in,
      check_out,
      rooms,
      total_guests,
      mattress,
      amount,
      first_name,
      last_name,
      phone_number,
      email,
      address1,
      address2,
      city,
      state,
    } = req.body;
    const notes: bookingPayload = {
      id: req.params.id,
      check_in,
      check_out,
      rooms,
      total_guests,
      mattress,
      amount,
      first_name,
      last_name,
      phone_number,
      email,
      address1,
      address2,
      city,
      state,
    };
    const bookingData = await BookingRooms(notes, req.transaction);
    return generalResponse(req, res, bookingData, 'Booking created successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to create booking', false, 'error', 500);
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const data = await cancelBookingData(String(req.params.id));
    return generalResponse(req, res, data, 'Booking cancelled successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to cancel booking', false, 'error', 500);
  }
};

const createRoomRule = async (req: Request, res: Response) => {
  try {
    const payload: IRoomPriceRules = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      price_per_night: req.body.price_per_night,
      is_default_price: false,
    };

    // Check for duplicate rule name
    const existingRule = await findPriceRuleByName(payload.name);
    if (existingRule) {
      return generalResponse(
        req,
        res,
        null,
        'A rule with this name already exists.',
        false,
        'error',
        400,
      );
    }

    // Check for overlapping date range
    const overlappingRules = await findOverlappingDateRule(payload.start_date, payload.end_date);
    if (overlappingRules) {
      return generalResponse(
        req,
        res,
        null,
        'A price rule already exists for the given date range.',
        false,
        'error',
        400,
      );
    }

    const data = await createPriceRule(payload);
    return generalResponse(req, res, data, 'Room rule created successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to create price rule', false, 'error', 500);
  }
};

const DeleteRoomRule = async (req: Request, res: Response) => {
  try {
    const data = await deletePriceRuleData(String(req.query.id));
    return generalResponse(req, res, data, 'Room rule deleted successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to delete room rule', false, 'error', 500);
  }
};

const updateRoomRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: IRoomPriceRules = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      price_per_night: req.body.price_per_night,
      is_default_price: req.body.is_default_price,
    };

    // Check for duplicate rule name
    const existingRule = await findPriceRuleByName(payload.name, id);
    if (existingRule) {
      return generalResponse(
        req,
        res,
        null,
        'A rule with this name already exists.',
        false,
        'error',
        400,
      );
    }

    // Check for overlapping date range
    const overlappingRules = await findOverlappingDateRule(
      payload.start_date,
      payload.end_date,
      id,
    );
    if (overlappingRules) {
      return generalResponse(
        req,
        res,
        null,
        'A price rule already exists for the given date range.',
        false,
        'error',
        400,
      );
    }

    const data = await updatePriceRuleData(id, payload);
    return generalResponse(req, res, data, 'Room rule updated successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to update room rule', false, 'error', 500);
  }
};

const PriceRules = async (req: Request, res: Response) => {
  try {
    const { checkInDate } = req.query;
    const data = await fetchPriceRuleData(checkInDate as string);
    return generalResponse(req, res, data, 'Price rule List fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to fetch price rule list', false, 'error', 500);
  }
};

const calculatePrice = async (req: Request, res: Response) => {
  try {
    const { check_in, check_out, total_rooms } = req.query;
    const timeZone = 'Asia/Kolkata';
    const checkIn = parseISO(check_in as string);
    const checkOut = parseISO(check_out as string);
    const totalRooms = parseInt(total_rooms as string);
    const nights = eachDayOfInterval({
      start: checkIn,
      end: checkOut,
    });

    let totalPrice = 0;
    const metadata = [];
    const defaultPriceRule = await fetchDefaultPriceRule();
    for (const date of nights) {
      const istDate = toZonedTime(date, timeZone);
      const normalizedDate = startOfDay(istDate);
      const priceRule = await findPriceRuleByDate(normalizedDate);
      let price = 0;
      if (priceRule) {
        price = priceRule.price_per_night * totalRooms;
      } else {
        price = defaultPriceRule?.price_per_night * totalRooms;
      }
      totalPrice += price;
      metadata.push({
        date,
        price,
      });
    }

    return generalResponse(
      req,
      res,
      {
        totalPrice,
        metadata,
      },
      'Price calculated successfully',
      false,
    );
  } catch (error) {
    return generalResponse(req, res, error, 'Failed to calculate price', false, 'error', 500);
  }
};

export {
  AdminDashboard,
  calculatePrice,
  cancelBooking,
  createBooking,
  createRoomRule,
  DeleteBooking,
  DeleteRoomRule,
  PriceRules,
  updateBooking,
  updateRoomRule,
};
