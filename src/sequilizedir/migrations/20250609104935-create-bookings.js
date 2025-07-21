"use strict";

const { ref } = require("joi");

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
          check_in: { type: Sequelize.DATE, allowNull: false },
          check_out: { type: Sequelize.DATE, allowNull: false },
          rooms_booked: { type: Sequelize.INTEGER, allowNull: false },
          total_guests: { type: Sequelize.INTEGER, allowNull: false },
          extra_mattresses: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
          },
          total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          payment_id: { type: Sequelize.UUID, allowNull: true },
          payment_type_id: { type: Sequelize.INTEGER, allowNull: true },
          created_by: {
            type: Sequelize.STRING,
            allowNull: false,
            default: "SYSTEM",
          },
          status: {
            type: Sequelize.STRING,
            allowNull: false,
            default: "pending",
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
