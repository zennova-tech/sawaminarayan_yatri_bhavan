import { bookingPayload } from '@/interfaces/types/bookingInterfaces';
import Booking, { IBooking } from '@/sequilizedir/models/booking.model';
import HotelSettings from '@/sequilizedir/models/hotelSettings.model';
import { Request } from 'express';
import { literal, Op, Transaction } from 'sequelize';

const hotelDetails = async (req: Request) => {
  return await HotelSettings.findOne({
    attributes: [
      'total_rooms',
      'available_rooms',
      'booked_rooms',
      'room_amount',
      'room_capacity',
      'mattress_amount',
      'check_in_time',
      'check_out_time',
      'under_maintenance_rooms',
    ],
    transaction: req.transaction,
  });
};

const fetchBookingsData = async (checkInDate?: string) => {
  return await Booking.findAll({
    attributes: [
      'id',
      [literal(`CONCAT(first_name || ' ' || last_name)`), 'name'],
      'check_in',
      'check_out',
      'rooms_booked',
      'guests_per_room',
      'extra_mattresses',
      'total_amount',
      'phone_number',
    ],
    where: {
      ...(checkInDate ? { check_in: new Date(checkInDate) } : {}),
    },
  });
};

const BookingRooms = async (
  data: bookingPayload,
  transaction: Transaction,
  payment_id?: string,
  method?: string
) => {
  const bookingPayload: IBooking = {
    check_in: data.check_in,
    check_out: data.check_out,
    rooms_booked: data.rooms,
    guests_per_room: data.guest_per_room,
    extra_mattresses: data.mattress,
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    email: data.email,
    total_amount: data.amount,
    payment_id,
    payment_type: method,
    address_line_1: data.address1,
    address_line_2: data.address2,
    city: data.city,
    state: data.state,
  };
  const hotelSettings = await HotelSettings.findOne({ transaction });
  hotelSettings.booked_rooms = (hotelSettings.booked_rooms || 0) + data.rooms;
  hotelSettings.available_rooms =
    (hotelSettings.available_rooms || 0) - data.rooms;
  if (hotelSettings.available_rooms < 0) {
    throw new Error('Not enough available rooms');
  }
  await hotelSettings.save({ transaction });
  return await Booking.create(bookingPayload, { transaction });
};

const deleteBookingData = async (id: string) => {
  return await Booking.destroy({
    where: { id },
  });
};

const getAvailableRooms = async (checkInDate: Date, checkOutDate: Date) => {
  const overlappingBookings = await Booking.findAll({
    where: {
      check_in: {
        [Op.lt]: checkOutDate, // booking starts before user's checkout
      },
      check_out: {
        [Op.gt]: checkInDate, // booking ends after user's check-in
      },
    },
  });

  // Sum up rooms booked in these bookings
  const roomsBooked = overlappingBookings.reduce(
    (sum, booking) => sum + booking.rooms_booked,
    0
  );

  const hotelSettingData = await HotelSettings.findOne();

  const availableRooms =
    hotelSettingData.total_rooms -
    hotelSettingData.under_maintenance_rooms -
    roomsBooked;

  return availableRooms > 0 ? availableRooms : 0;
};

export { BookingRooms, deleteBookingData, fetchBookingsData, hotelDetails, getAvailableRooms };
