import Booking from "@/sequilizedir/models/booking.model";
import HotelSettings from "@/sequilizedir/models/hotelSettings.model";
import { Request } from "express";
import { literal } from "sequelize";

const hotelDetails = async (req: Request) => {
  return await HotelSettings.findOne({
    attributes: [
      "total_rooms",
      "available_rooms",
      "booked_rooms",
      "room_amount",
      "room_capacity",
      "mattress_amount",
    ],
    transaction: req.transaction,
  });
};

const fetchBookingsData = async (checkInDate?: string) => {
  return await Booking.findAll({
    attributes: [
      "id",
      [literal(`CONCAT(first_name || ' ' || last_name)`), 'name'],
      "check_in",
      "check_out",
      "rooms_booked",
      "guests_per_room",
      "extra_mattresses",
      "total_amount",
      "phone_number",
    ],
    where: {
      ...(checkInDate ? { check_in: new Date(checkInDate) } : {}),
    },
  });
};

export { hotelDetails, fetchBookingsData };
