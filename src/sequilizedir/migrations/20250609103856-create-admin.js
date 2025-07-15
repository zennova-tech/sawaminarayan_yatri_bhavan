"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          email: { type: Sequelize.STRING, allowNull: true },
          first_name: { type: Sequelize.STRING, allowNull: false },
          role: {
            type: Sequelize.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
          },
          last_name: { type: Sequelize.STRING, allowNull: true },
          phone_number: { type: Sequelize.STRING, allowNull: false },
          address_line_1: { type: Sequelize.STRING, allowNull: true },
          address_line_2: { type: Sequelize.STRING, allowNull: true },
          city: { type: Sequelize.STRING, allowNull: false },
          state: { type: Sequelize.STRING, allowNull: false },
          pin_code: { type: Sequelize.STRING, allowNull: true },
          password: { type: Sequelize.STRING, allowNull: true },
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
      await queryInterface.dropTable("users", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
