import { Role } from '@/interfaces/types/bookingInterfaces';
import bcrypt from 'bcryptjs';
import { sequelize } from '../models';
import Users from '../models/users.model';

const seedAdmin = async () => {
  const transaction = await sequelize.transaction();
  try {
    const users = [
      {
        email: 'swami.admin@yopmail.com',
        first_name: 'yatra',
        last_name: 'dham',
        phone_number: '8855445588',
        password: 'Admin@123',
        role: Role.Admin,
        city: 'bangalore',
        state: 'karnataka',
      },
      {
        email: 'info@swaminarayanhotels.com',
        first_name: 'Swaminarayan',
        last_name: 'dham',
        phone_number: '6352686293',
        password: 'Swaminarayan@1005',
        role: Role.Admin,
        city: 'Ahmedabad',
        state: 'Gujarat',
      },
    ];
    for (const user of users) {
      const existingAdmin = await Users.findOne({
        where: { email: user.email },
      });
      if (existingAdmin) {
        console.info(`Admin with email ${user.email} already exists`);
        return;
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await Users.create({ ...user, password: hashedPassword }, { transaction });
      console.info(`Created user: ${user.email}`);
    }
    await transaction.commit();
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error(`Something went wrong while seeding admin data ${error}`);
    process.exit(1);
  }
};

seedAdmin();
