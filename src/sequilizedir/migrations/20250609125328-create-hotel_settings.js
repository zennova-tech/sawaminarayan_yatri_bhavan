"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "hotel_settings",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          total_rooms: { type: Sequelize.INTEGER, allowNull: false },
          available_rooms: { type: Sequelize.INTEGER },
          booked_rooms: { type: Sequelize.INTEGER },
          under_maintenance_rooms: { type: Sequelize.INTEGER },
          room_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          room_capacity: { type: Sequelize.INTEGER, allowNull: false },
          mattress_amount : { type: Sequelize.DECIMAL(6, 2), allowNull: false },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: { type: Sequelize.DATE },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("hotel_settings", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
