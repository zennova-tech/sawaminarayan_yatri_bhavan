import { sequelize } from '@/sequilizedir/models';
import Booking from '@/sequilizedir/models/booking.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';
import { col, fn, literal, Op, QueryTypes } from 'sequelize';

const getUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const users = await Booking.findAll({
      where: search
        ? {
            [Op.or]: [
              { first_name: { [Op.like]: `%${search}%` } },
              { last_name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              {
                [Op.and]: [
                  { first_name: { [Op.like]: `%${search?.split(' ')[0]}%` } },
                  { last_name: { [Op.like]: `%${search?.split(' ')[1]}%` } },
                ],
              },
              {
                [Op.and]: [
                  { first_name: { [Op.like]: `%${search?.split(' ')[1]}%` } },
                  { last_name: { [Op.like]: `%${search?.split(' ')[0]}%` } },
                ],
              },
            ],
          }
        : {},
      attributes: [
        [fn('DISTINCT', col('phone_number')), 'phone_number'],
        [literal(`CONCAT("first_name", ' ', "last_name")`), 'name'],
        [fn('MAX', col('updated_at')), 'latest_updated_at'],
        'phone_number',
        'email',
        'city',
        'state',
      ],
      group: ['phone_number', 'email', 'city', 'state', 'first_name', 'last_name'],
    });

    return generalResponse(req, res, users, 'Users fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, null, 'Users fetching failed', false, 'error', 500);
  }
};

export { getUsers };
