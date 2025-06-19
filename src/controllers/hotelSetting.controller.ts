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
    return generalResponse(
      req,
      res,
      settings,
      'Hotel settings data updated successfully',
      false
    );
  } catch (error) {
    return generalResponse(
      req,
      res,
      null,
      'Failed to update hotel settings data',
      false,
      'error',
      500
    );
  }
};
export { HotelSettingUpdate };
