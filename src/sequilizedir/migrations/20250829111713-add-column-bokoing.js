'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'bookings',
        'updated_amount',
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('bookings', 'updated_amount', {
        transaction: t,
      });
    });
  },
};
