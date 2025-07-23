'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'bookings',
        'email',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'first_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'last_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'phone_number',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'address_line_1',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'address_line_2',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'city',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bookings',
        'state',
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
      await queryInterface.removeColumn('bookings', 'email', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'first_name', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'email', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'first_name', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'last_name', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'phone_number', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'address_line_1', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'address_line_2', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'city', {
        transaction: t,
      });
      await queryInterface.removeColumn('bookings', 'state', {
        transaction: t,
      });
    });
  },
};
