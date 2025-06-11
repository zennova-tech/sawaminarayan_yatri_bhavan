import HotelSettings from '@/sequilizedir/models/hotelSettings.model';
import { Request } from 'express';

const hotelDetails = async (req: Request) => {
  return await HotelSettings.findOne({
    attributes: [
      'total_rooms',
      'available_rooms',
      'booked_rooms',
      'room_amount',
      'room_capacity',
      'mattress_amount',
    ],
    transaction: req.transaction,
  });
};
export { hotelDetails };
