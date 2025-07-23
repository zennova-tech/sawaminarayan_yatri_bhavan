import Booking from '@/sequilizedir/models/booking.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';
import { literal, Op } from 'sequelize';

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
        [literal(`CONCAT("first_name", ' ', "last_name")`), 'name'],
        'phone_number',
        'email',
        'city',
        'state',
      ],
      group: ['phone_number', 'id'],
      order: [['updated_at', 'DESC']],
    });
    return generalResponse(req, res, users, 'Users fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, null, 'Users fetching failed', false, 'error', 500);
  }
};

export { getUsers };
