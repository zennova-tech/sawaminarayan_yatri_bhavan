import bcrypt from 'bcryptjs';
import { sequelize } from '../models';
import Users from '../models/users.model';
import { Role } from '@/interfaces/types/bookingInterfaces';

const seedAdmin = async () => {
  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = {
      email: 'swami.admin@yopmail.com',
      first_name: 'yatra',
      last_name: 'dham',
      phone_number: '8855445588',
      password: hashedPassword,
      role: Role.Admin,
      city: 'bangalore',
      state: 'karnataka',
    };
    const existingAdmin = await Users.findOne({
      where: { email: 'swami.admin@yopmail.com' },
    });
    if (existingAdmin) {
      console.info(`Admin with email ${admin.email} already exists`);
      return;
    }
    await Users.create(admin, { transaction });
    await transaction.commit();
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error(`Something went wrong while seeding admin data ${error}`);
    process.exit(1);
  }
};

seedAdmin();
