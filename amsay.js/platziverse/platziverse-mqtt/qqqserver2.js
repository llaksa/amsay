'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const configSetUp = require('../config')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true // así la información viene binaria y la va a poder transmitir mucho más fácil
}

const settings = {
  port: 1883,
  backend
}

const config = configSetUp({setup: false}) 

/*
const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  loggin: s => debug(s),
  operatorsAliases:false // peratorsAliases: Sequelize.Op 
}
*/

const server = new mosca.Server(settings)

let Agent, Metric

server.on('clientConnected', client => { // cuando el cliente se conecta al servidor
  debug(`Client Connected: ${client.id}`)
})

server.on('clientDisconnected', client => { // cuando el cliente se disconecta del servidor
  debug(`Client Disconnected: ${client.id}`)
})

server.on('published', (packet, client) => { // cuando se publica en el servidor
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})

/* mosca.Server es un event emitter, es decir que vamos a poder agregar funciones y agregar listener cuando el servidor lance eventos (estos ventos serán cuando el servidor esté listo o corriendo) */
server.on('ready', async () => {
  // como la funcion de configurción de la base de datos resuleve a una promsea podemos usar async await (en el callback de este bloque) para hacerlo más fácil
  // es por esto que, dado que aquí es donde se inicializa el servidor mqtt
  const services = await db(config).catch(handleFatalError)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

// UNA MUY BUENA PRÁCTICA DE DESARROLLO CON NODE JS:
process.on('uncaughtException', handleFatalError) // Esto pasa a nivel del proceso, si se lanza alguna exepción, es mejor manejarla en alguna parte, en este caso handleFatalError 
process.on('unhandledRejection', handleFatalError) // cuando no se maneja el rejection de una promesa, se debe pasar un manejador de errores