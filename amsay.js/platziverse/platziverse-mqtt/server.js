'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true // así la información viene binaria y la va a poder transmitir mucho más fácil
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)

/* mosca.Server es un event emitter, es decir que vamos a poder agregar funciones y agregar listener cuando el servidor lance eventos (estos ventos serán cuando el servidor esté listo o corriendo) */
server.on('ready', () => {
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})