'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: "admin@gmail.com",
      password: "123456", // phải băm ra => hash password
      firstName: 'Ngô',
      lastName: 'Lân',
      address: "Da Nang",
      gender: 1,
      
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
