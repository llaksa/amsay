'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const path = require('path') // permite tener rutas dinámicas y es compatible tanto en linux, mac o windows
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const platziverseAgent = require('platziverse-agent')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const agent = new platziverseAgent()

// creando una instancia de socket.io y le pasamos la instancia del servidor creado anteriormente
// con esto quedaron integrados socket.io y express
// socket io se encarga de montar una ruta en el express server que contiene el codigo del javascript del cliente para meterlo en el html ya que socket.io se encarga de conectarse al servidor y llevar la info de un lado para otro
// socket.io trabaja escuchando eventos, muy similar a mqtt
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public'))) // __dirname = carpeta actual

// socket.io / websockets
// cada vez que un cliente se conecte a un servidor de websockets, este evento se va a ejecutar y nos va a devolver un socket (que es un object)
// se puede entender como si fuera un servidor mqtt pero con un protocolo diferente: el de websockets
io.on('connect', socket => {
    debug(`Connected ${socket.id}`)

    //= ========= PARTE DEMOSTRATIVA
    /*
    // como socket io trabaja como un event emitter, por lo que se puede escuchar aqui los mensajes:
    socket.on('agent/message', payload => {
        console.log(payload)
    })

    setInterval(() => {
        socket.emit('agent/message', { agent: 'xxx-yyy' })
    }, 2000)
    */

    agent.on('agent/message', payload => {
        socket.emit('agent/message', payload)
    })

    agent.on('agent/connected', payload => {
        socket.emit('agent/connected', payload)
    })

    agent.on('agent/disconnected', payload => {
        socket.emit('agent/disconnected', payload)
    })
})

function handleFatalError (err) {
    console.error(`${chalk.red('[falal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1) // exit code = 1 means there was an error
}

server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
    agent.connect()
})