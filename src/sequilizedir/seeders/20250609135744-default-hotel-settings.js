"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "hotel_settings",
      [
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          total_rooms: 16,
          available_rooms: 16,
          booked_rooms: 0,
          under_maintenance_rooms: 0,
          room_amount: 1500.0,
          room_capacity: 3,
          mattress_amount: 300.0,
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("hotel_settings", null, {});
  },
};
