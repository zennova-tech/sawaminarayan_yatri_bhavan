import Users from '@/sequilizedir/models/users.model';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';
import { Op } from 'sequelize';


const getUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const users = await Users.findAll({
      where: search ? {
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
      } : {},
    });
    return generalResponse(req, res, users, 'Users fetched successfully', false);
  } catch (error) {
    return generalResponse(req, res, null, 'Users fetching failed', false, 'error', 500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Users.destroy({ where: { id } });
    return generalResponse(req, res, null, 'User deleted successfully', false);
  } catch (error) {
    return generalResponse(req, res, null, 'User deletion failed', false, 'error', 500);
  }
};

export {
  getUsers,
  deleteUser,
};
