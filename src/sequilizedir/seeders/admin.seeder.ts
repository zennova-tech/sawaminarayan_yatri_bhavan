import bcrypt from "bcryptjs";
import Admin from "../models/admin.model";
import { sequelize } from "../models";

const seedAdmin = async () => {
  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = {
      email: "swami.admin@yopmail.com",
      first_name: "yatra",
      last_name: "dham",
      phone_number: "8855445588",
      password: hashedPassword,
    };
    const existingAdmin = await Admin.findOne({
      where: { email: "swami.admin@yopmail.com" },
    });
    if (existingAdmin) {
      console.info(`Admin with email ${admin.email} already exists`);
      return;
    }
    await Admin.create(admin, { transaction });
    await transaction.commit();
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error(`Something went wrong while seeding admin data ${error}`);
    process.exit(1);
  }
};

seedAdmin();
