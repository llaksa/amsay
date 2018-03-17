'use strict'

const http = require('http')
const express = require('express')
const asyncify = require('express-asyncify')
const debug = require('debug')('platziverse:api')
const chalk = require('chalk')

const api = require('./api')

const port = process.env.PORT || 5000
const app = asyncify(express())
const server = http.createServer(app)

// middlewares son funciones que se ejecutan antes de que la petición llegue a la ruta final
app.use('/api', api) // montando un middleware de express

// Express Error Handler
app.use((err, req, res, next) => { // el objeto "next" simepre va a estar presente en el middleware
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) { // para otros tipos de errores podemos hacer algo así (en este caso un error 404)
    return res.status(404).send({ error: err.message }) // return aquí para evitar el else
  }

  res.status(500).send({error: err.message}) // por defecto si llega un error, vamos a devolver un server error, que es un objeto JSON con el mensaje de error (es una respuesta típica de un API)
})

function handleFatalError (err) {
  console.error(`${chalk.red('[falal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1) // exit code = 1 means there was an error
}

if (!module.parent) { // el if devuelve falso (se ignora el código de adentro) si este archivo (server.js) es requerido, y verdadero (se ejecuta el código de adentro) en caso se ejecute con node
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
  })
}

module.exports = server
