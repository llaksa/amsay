'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const asyncify = require('express-asyncify') // express no soporta funciones asíncronas, por ese debemos requerir este módulo
const auth = require('express-jwt') // vamos a asegurar ruta por ruta con esto
const db = require('platziverse-db')
const setupConfig = require('../platziverse-common/defaultConfig')

const conf = setupConfig({loggin: s => debug(s)}).db

const api = asyncify(express.Router())

let services, Agent, Metric

// siempre que tengamos api.use entendámoslo como un middleware o intermediarios para llegar a otro lado - siempre llevan el objeto next
api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(conf)
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

api.get('/agents', auth(config.auth), async (req, res, next) => {
  debug('A request was maked')

  let agents = []
  try {
    agents = await Agent.findConnected()
  } catch (e) {
    return next(e)
  }

  res.send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => { // ":uuid" means: some URL parameter que podemos usar en el backend. EL argumento "next" no es obligatorio, pero en este caso sí lo usamos
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
