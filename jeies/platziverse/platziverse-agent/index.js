'use strict'

const EventEmitter = require('events')
const debug        = require('debug')('platziverse:agent')
const os           = require('os')
const util         = require('util') // para convertir un callback en promesa
const mqtt         = require('mqtt') // recordar que este cliente usa el puerto 1883 por default
const defaults     = require('defaults')
const uuid         = require('uuid')

const { parsePayload } = require('../platziverse-common/utils')

const options = {
  name: 'untitled',
  username: 'platzi',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
}

class PlatziverseAgent extends EventEmitter {
  constructor (opts) {
    super()

    this._options = defaults(opts, options)
    this._started = false // estado de conexión o desconexión del agente
    this._timer   = null  // 
    this._client  = null  // el dominio usado por el broker mqtt
    this._agentId = null  // un uuid random
    this._metrics = new Map() // guardar los valores de las métricas en pares key: value
  }

  addMetric (type, fn) {
    this._metrics.set(type, fn)
  }

  removeMetric (type) {
    this._metrics.delete(type)
  }

  connect () {
    if (!this._started) {
      const opts = this._options
      this._client = mqtt.connect(opts.mqtt.host)
      this._started = true

      this._client.subscribe('agent/message')
      this._client.subscribe('agent/connected')
      this._client.subscribe('agent/disconnected')

      this._client.on('connect', () => {
        this._agentId = uuid.v4()

        this.emit('connected', this._agentId)

        this._timer = setInterval(async () => {
          if (this._metrics.size > 0) {
            let message = {
              agent: {
                uuid: this._agentId,
                username: opts.username,
                name: opts.name,
                hostname: os.hostname() || 'localhost', // os.hostname: 'HorsePowercito'
                pid: process.pid // Ppid: process Identifier
              },
              metrics: [],
              timestamp: new Date().getTime()
            }

            for (let [ metric, fn ] of this._metrics) {
              if (fn.length === 1) { // si una función tiene un argumento, entonces es un callback
                fn = util.promisify(fn)
              }

              message.metrics.push({
                type: metric,
                value: await Promise.resolve(fn())
              })
            }

            debug('Sending', message)

            this._client.publish('agent/message', JSON.stringify(message))
            this.emit('message', message)
          }
        }, opts.interval)
      })

      this._client.on('message', (topic, payload) => {
        payload = parsePayload(payload)

        let broadcast = false
        switch (topic) {
          case 'agent/connected':
          case 'agent/disconnected':
          case 'agent/message':
            broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
            break
        }

        if (broadcast) {
          this.emit(topic, payload)
        }
      })

      this._client.on('error', () => this.disconnect())
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected', this._agentId)
      this._client.end()
    }
  }
}

module.exports = PlatziverseAgent

// este archivo:
// genera un objeto que es un emisor de eventos que va notificar métricas y también va recibir mensages de otros agentes (o sea será un cliente que reciba y emita mensajes) conectados al servidor platziverse-mqtt
