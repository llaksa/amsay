'use strict'

const Sequelize = require('sequelize')
let sequelize = null // tener un singleton: un objeto que solo tiene una instancia

module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Sequelize(config) // si la instancia no existe, se crea
  }
  return sequelize
}

// este archivo:
// genera una función que necesita cierta configuración de nuestra base de datos para devolvernos una instancia específica de sequelize
