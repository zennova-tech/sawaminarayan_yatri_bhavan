'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'hotel_settings',
        'check_in_time',
        {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: '10:00:00',
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'hotel_settings',
        'check_out_time',
        {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: '09:00:00',
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('hotel_settings', 'check_in_time', {
        transaction: t,
      });
      await queryInterface.removeColumn('hotel_settings', 'check_out_time', {
        transaction: t,
      });
    });
  },
};
