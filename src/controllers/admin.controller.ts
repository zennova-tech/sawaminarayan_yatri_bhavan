import { bookingPayload } from '@/interfaces/types/bookingInterfaces';
import {
  BookingRooms,
  deleteBookingData,
  fetchBookingsData,
} from '@/repository/booking.repository';
import Booking from '@/sequilizedir/models/booking.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';

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
      'Booking List fetched successfully',
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to fetch booking list',
      false,
      'error',
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
      'Booking deleted successfully',
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to delete booking',
      false,
      'error',
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
      'Booking created successfully',
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to create booking',
      false,
      'error',
      500
    );
  }
};

export { AdminDashboard, createBooking, DeleteBooking };
