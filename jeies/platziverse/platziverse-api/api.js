'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const expAsyncify = require('express-asyncify') // express no soporta funciones asíncronas, por ese debemos requerir este módulo
const expJwt = require('express-jwt') // vamos a asegurar ruta por ruta con esto
const guard = require('express-jwt-permissions')() // permite reconocer los permisos de nuestro JWT
const db = require('platziverse-db')
const configSetup = require('../platziverse-common/defaultConfig')

const config = configSetup({loggin: s => debug(s)})

const api = expAsyncify(express.Router())

let services, Agent, Metric

// siempre que tengamos api.use entendámoslo como un middleware o intermediarios para llegar a otro lado - siempre llevan el objeto next
api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next() // esto es para que el middleware continue con la ejecución y atienda las demás rutas
})

//= ==========================================================================
// AÑADIENDO A api LAS RUTAS QUE VAMOS A NECESITAR:
//= ==========================================================================

// recordar que el middleware api acepta en sus métodos get(), post(), etc... como primer argumento a la ruta y como último argumento al handler de la ruta (callback con (req, res, next)); pero podemos poner tantos otros callbacks entre ellos como queramos 
// en este caso usaremos un callback intermedio para usarlo con con express-jwt

// expJwt permite usar la palabra secreta desde config.auth para comparar con JWT y darnos o no la autorización
api.get('/agents', expJwt(config.auth), async (req, res, next) => {
  debug('A request was maked')

  console.log(req)
  // el token (para un username) generado por jwt debe ponerse en el header de autorización en el request http, por eso se envía en el la variable "req"
  const { user } = req

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  let agents = []
  try {
    if (user.admin) {
      agents = await Agent.findConnected() // si el usuario es admin, se muestra todos los agentes conectados
    } else {
      agents = await Agent.findByUsername(user.username) // si ingresa un no admin, se muestra el agente que tiene como username, el username del token dado en la petición
    }
  } catch (e) {
    return next(e)
  }

  res.send(agents)
})

// ":uuid" means: some URL parameter que podemos usar en el backend. EL argumento "next" no es obligatorio, pero en este caso sí lo usamos
// en este caso llamamos a nuestros permisos metrics:read pero los podemos llamar como queramos
api.get('/agent/:uuid', expJwt(config.auth), guard.check(['metrics:read']) ,async (req, res, next) => { 
  const { uuid } = req.params

  debug(`request to /agent/${uuid}`)

  let agent
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`))
  }

  res.send(agent)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /metrics/${uuid}`)

  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params

  debug(`request to /metrics/${uuid}/${type}`)

  let metrics = []
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    return next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid} and type ${type}`))
  }

  res.send(metrics)
})

module.exports = api
