'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')

const configSetUp = require('../platziverse-common/defaultConfig')
const { parsePayload } = require('../platziverse-common/utils')

const config = configSetUp({logging: s => debug(s), setup: false}).db

/*
const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s)
}
*/

const backend = {
  type: 'redis',
  redis,
  return_buffers: true // así la información viene binaria y la va a poder transmitir mucho más fácil
}

const settings = {
  port: 1883, // 1883 es el puerto por defecto de mqttJS, por eso configuramos a moscaJS con ese puerto
  backend
}

const server = new mosca.Server(settings)
// implementar la persistencia de los mensajes en la base de datos
// Referencia de los agentes que tenemos conectados
const clients = new Map()

let Agent, Metric

server.on('clientConnected', client => { // cuando el cliente se conecta al servidor
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async (client) => { // cuando el cliente se disconecta del servidor
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)

  if (agent) {
    // Mark Agent as Disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }

    // Delete Agent from Clients List
    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`)
  }
})

server.on('published', async (packet, client) => { // cuando se publica en el servidor y se usa async porque usamos a "Agent" que es resultado de una función asíncrona
  debug(`Received: ${packet.topic}`)

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      debug(`Payload: ${packet.payload}`)

      const payload = parsePayload(packet.payload)

      if (payload) {
        payload.agent.connected = true

        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError(e)
        }

        debug(`Agent ${agent.uuid} saved`)

        // Notify Agent is Connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store Metrics
        for (let metric of payload.metrics) { // un for of es como un foreach pero que soporta async await
          let m

          // RETO 3: cambiar el try y catch con promesas
          // m = new Promise((resolve, rejection) => {
          //  resolve(Metric.create(agent.uuid, metric))
          // }).catch(e => handleError(e))

          try {
            m = await Metric.create(agent.uuid, metric)
          } catch (e) {
            return handleError(e)
          }

          debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
        }
      }
      break
  }
})

/* mosca.Server es un event emitter, es decir que vamos a poder agregar funciones y agregar listener cuando el servidor lance eventos (estos ventos serán cuando el servidor esté listo o corriendo) */
server.on('ready', async () => {
  // como la funcion de configurción de la base de datos resuleve a una promsea podemos usar async await (en el callback de este bloque) para hacerlo más fácil
  // es por esto que, dado que aquí es donde se inicializa el servidor mqt
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

function handleError (err) {
  console.error(`${chalk.red('[error]')} ${err.message}`)
  console.error(err.stack)
}

// UNA MUY BUENA PRÁCTICA DE DESARROLLO CON NODE JS:
process.on('uncaughtException', handleFatalError) // Esto pasa a nivel del proceso, si se lanza alguna exepción, es mejor manejarla en alguna parte, en este caso handleFatalError
process.on('unhandledRejection', handleFatalError) // cuando no se maneja el rejection de una promesa, se debe pasar un manejador de errores

// este archivo:
// le pasa una configuración al módulo de platziverse-db logrando conectarse a una base de datos sql con los modelos Agent y Metric que tienen métodos para hacer queries más simples
// el módulo mosca nos permiter escuchar el puerto de un cliente mqtt para captar los mensajes y redistribuirlos, es decir, es un servidor(que se puede configurar con redis o mongo) escuchando eventos para realizar acciones rspecto de agentes conectados al servidor
