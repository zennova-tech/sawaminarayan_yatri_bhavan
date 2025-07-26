'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'bookings',
        'payment_status',
        {
          type: Sequelize.ENUM('pending', 'complimentary', 'paid'),
          allowNull: false,
          defaultValue: 'pending',
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'amount_paid',
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'amount_due',
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'remarks',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('bookings', 'payment_status', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'amount_paid', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'amount_due', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'remarks', {
        transaction: t,
      });
    });
  },
};
