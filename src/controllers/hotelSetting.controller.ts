import { getAvailableRooms } from '@/repository/booking.repository';
import HotelSettings from '@/sequilizedir/models/hotelSettings.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';

const HotelSettingUpdate = async (req: Request, res: Response) => {
  try {
    const settings = await HotelSettings.findOne();
    if (!settings) {
      return generalResponse(req, res, null, 'Hotel settings not found', false);
    }
    await settings.update(req.body);
    return generalResponse(req, res, settings, 'Hotel settings data updated successfully', false);
  } catch (error) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to update hotel settings data',
      false,
      'error',
      500,
    );
  }
};

const getAvailableRoomsController = async (req: Request, res: Response) => {
  try {
    const { check_in, check_out } = req.query;

    const checkIn = new Date(check_in as string);
    const checkOut = new Date(check_out as string);
    const availableRooms = await getAvailableRooms(checkIn, checkOut);
    return generalResponse(req, res, availableRooms, 'Available rooms fetched successfully', false);
  } catch (ex) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to update hotel settings data',
      false,
      'error',
      500,
    );
  }
};

export { getAvailableRoomsController, HotelSettingUpdate };
