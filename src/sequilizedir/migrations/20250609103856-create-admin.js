"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "admins",
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          email: { type: Sequelize.STRING, allowNull: false, unique: true },
          first_name: { type: Sequelize.STRING, allowNull: true },
          last_name: { type: Sequelize.STRING, allowNull: true },
          phone_number: { type: Sequelize.STRING, allowNull: true },
          password: { type: Sequelize.STRING, allowNull: false },
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
      await queryInterface.dropTable("admins", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
