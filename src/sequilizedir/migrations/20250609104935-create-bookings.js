"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "bookings",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          email: { type: Sequelize.STRING, allowNull: false },
          first_name: { type: Sequelize.STRING, allowNull: false },
          last_name: { type: Sequelize.STRING, allowNull: true },
          phone_number: { type: Sequelize.STRING, allowNull: false },
          check_in: { type: Sequelize.DATE, allowNull: false },
          check_out: { type: Sequelize.DATE, allowNull: false },
          rooms_booked: { type: Sequelize.INTEGER, allowNull: false },
          guests_per_room: { type: Sequelize.INTEGER, allowNull: false },
          extra_mattresses: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          payment_id: { type: Sequelize.UUID, allowNull: true },
          payment_type_id: { type: Sequelize.INTEGER, allowNull: true },
          created_by: {
            type: Sequelize.STRING,
            allowNull: false,
            default: "SYSTEM",
          },
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
      await queryInterface.dropTable("bookings", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
