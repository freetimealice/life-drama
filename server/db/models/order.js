const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  status: {
    type: Sequelize.ENUM('Bought', 'Cart')
  },
  purchasePrice: {
    type: Sequelize.DECIMAL(10, 2)
  }
})

module.exports = Order