'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('bookings', 'payment_id', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'payment_type_id', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'phone_number', {
        transaction: t,
      });
      await queryInterface.addColumn(
        'bookings',
        'payment_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'bookings',
        'payment_type',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'bookings',
        'phone_number',
        {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('bookings', 'payment_id', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'payment_type', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'phone_number', {
        transaction: t,
      });
      await queryInterface.addColumn(
        'bookings',
        'payment_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'bookings',
        'payment_type_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'bookings',
        'phone_number',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t }
      );
    });
  },
};
