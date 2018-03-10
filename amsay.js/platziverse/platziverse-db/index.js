'use strict'

const setupDatabase = require('./lib/db') // jala un objeto sequelize (con una configuración dada como parámetro) y lo crea en caso no exista
const setupAgentModel = require('./models/agent') // jala el objeto sequelize (con la configuración dada como parámetro) correspondiente a la entidad agent
const setupMetricModel = require('./models/metric') // jala el objeto sequelize (con la configuración dada como parámetro) correspondiente a la entidad metric
const setupAgent = require('./lib/agent') // jala una función (que recibe como parámetro a los modelos Agent de la database) y permite usar varios métodos para filtrarlos, crearlos o actualizarlos
const defaults = require('defaults') // Permite crear un objeto de configuración por defecto, con parámetros por defecto
module.exports = async function (config) {
  config = defaults(config, { // si a la función exportada, no se le pasa ningún parámetro, se le asignará a "config" el valor del segundo parámetro de defaults() para que sea usado en las siguientes líneas de código
    dialect: `sqlite`, // para pruebas por defecto usaremos 'sqlite'
    pool: {
      max: 10, // máximo 10 conexiones a la base de datos
      min: 0, // mínimo cero conexiones a la base de datos
      idle: 10000 // si no pasa nada durante 10 segundos se lo saca del pool de conexiones
    },
    query: {
      raw: true // un dato json sencillo, solo datos básicos
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate() // que es similar a sequelize.authenticate().then(), solo que con await ... se detiene la ejecución del código hasta resolverse y si hay errores, deberán ser manejados por la función con async...

  // sequelize.sync() // configuración de la database. En caso los modelos de la app no existan en la base de datos, sequelize los creará en la base de datos.

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgent(AgentModel)
  const Metric = {}

  return {
    Agent, // Agent: Agent,
    Metric // Metric: Metric
  }
}
