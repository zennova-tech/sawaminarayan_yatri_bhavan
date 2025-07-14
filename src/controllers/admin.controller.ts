import { bookingPayload } from "@/interfaces/types/bookingInterfaces";
import {
  BookingRooms,
  deleteBookingData,
  fetchBookingsData,
} from "@/repository/booking.repository";
import {
  createPriceRule,
  deletePriceRuleData,
  updatePriceRuleData,
} from "@/repository/priceRules.repository";
import Booking from "@/sequilizedir/models/booking.model";
import { IRoomPriceRules } from "@/sequilizedir/models/roomPriceRules.model";
import { generalResponse } from "@/utils/generalResponse";
import { Request, Response } from "express";

const AdminDashboard = async (req: Request, res: Response) => {
  const { checkInDate } = req.query;
  try {
    const bookings: Booking[] | null = await fetchBookingsData(
      checkInDate as string
    );
    return generalResponse(
      req,
      res,
      bookings,
      "Booking List fetched successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to fetch booking list",
      false,
      "error",
      500
    );
  }
};

const DeleteBooking = async (req: Request, res: Response) => {
  try {
    const data = await deleteBookingData(String(req.query.id));
    return generalResponse(
      req,
      res,
      data,
      "Booking deleted successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to delete booking",
      false,
      "error",
      500
    );
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const notes: bookingPayload = {
      check_in: req.body.check_in,
      check_out: req.body.check_out,
      rooms: req.body.rooms,
      guest_per_room: req.body.guest_per_room,
      mattress: req.body.mattress,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      amount: req.body.amount,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
    };
    const data = await BookingRooms(notes, req.transaction);
    return generalResponse(
      req,
      res,
      data,
      "Booking created successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to create booking",
      false,
      "error",
      500
    );
  }
};

const createRoomRule = async (req: Request, res: Response) => {
  try {
    const payload: IRoomPriceRules = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      price_per_night: req.body.price_per_night,
      is_default_price: req.body.is_default_price,
    };
    const data = await createPriceRule(payload);
    return generalResponse(
      req,
      res,
      data,
      "Room rule created successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to create price rule",
      false,
      "error",
      500
    );
  }
};

const DeleteRoomRule = async (req: Request, res: Response) => {
  try {
    const data = await deletePriceRuleData(String(req.query.id));
    return generalResponse(
      req,
      res,
      data,
      "Room rule deleted successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to delete room rule",
      false,
      "error",
      500
    );
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
    const data = await updatePriceRuleData(id, payload);
    return generalResponse(
      req,
      res,
      data,
      "Room rule updated successfully",
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      error,
      "Failed to update room rule",
      false,
      "error",
      500
    );
  }
};

export {
  AdminDashboard,
  createBooking,
  DeleteBooking,
  createRoomRule,
  DeleteRoomRule,
  updateRoomRule,
};
