'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupMetricModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
// este archivo:
// genera un modelo / un schema / una tabla / o un ¡¿Cómo debe ser la tupla?! (en este caso "Metric") que necesita de la configuración de la base de datos para almacenarse en ella gracias a sequelize
