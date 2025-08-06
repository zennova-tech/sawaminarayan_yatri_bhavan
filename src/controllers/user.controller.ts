import Booking from '@/sequilizedir/models/booking.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';
import { col, fn, literal, Op } from 'sequelize';

const getUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const latestBookings = await Booking.findAll({
      paranoid: false,
      attributes: ['phone_number', [fn('MAX', col('updated_at')), 'updated_at']],
      where: {
        ...(search && {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            {
              [Op.and]: [
                { first_name: { [Op.iLike]: `%${search.split(' ')[0]}%` } },
                { last_name: { [Op.iLike]: `%${search.split(' ')[1] || ''}%` } },
              ],
            },
          ],
        }),
      },
      group: ['phone_number'],
      raw: true,
    });
    const users = await Booking.findAll({
      paranoid: false,
      where: {
        [Op.or]: latestBookings.map((b) => ({
          phone_number: b.phone_number,
          updated_at: b.updated_at,
        })),
      },
      attributes: [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'city',
        'state',
        'updated_at',
        [literal(`CONCAT("first_name", ' ', "last_name")`), 'name'],
      ],
    });

    return generalResponse(req, res, users, 'Users fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, null, 'Users fetching failed', false, 'error', 500);
  }
};

export { getUsers };
