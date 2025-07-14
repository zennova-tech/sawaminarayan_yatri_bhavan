"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "room_price_rules",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          name: { type: Sequelize.STRING, allowNull: false },
          start_date: { type: Sequelize.DATE, allowNull: false },
          end_date: { type: Sequelize.DATE, allowNull: false },
          price_per_night: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          is_default_price: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("room_price_rules", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
