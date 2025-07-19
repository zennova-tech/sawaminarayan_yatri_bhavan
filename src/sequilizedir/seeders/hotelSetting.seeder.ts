import { sequelize } from '../models';
import HotelSettings from '../models/hotelSettings.model';

const seedHotelSettings = async () => {
  const transaction = await sequelize.transaction();
  try {
    const initialSettings = {
      total_rooms: 16,
      available_rooms: 16,
      booked_rooms: 0,
      under_maintenance_rooms: 0,
      room_amount: 1500.0,
      room_capacity: 5,
      mattress_amount: 300.0,
      check_in_time: '12:00:00',
      check_out_time: '10:00:00',
    };
    const existingSetting = await HotelSettings.findOne();
    if (existingSetting) {
      console.info(`Settings are already available`);
      return;
    }
    await HotelSettings.create(initialSettings, { transaction });
    await transaction.commit();
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error(`Something went wrong while seeding settings data ${error}`);
    process.exit(1);
  }
};

seedHotelSettings();
