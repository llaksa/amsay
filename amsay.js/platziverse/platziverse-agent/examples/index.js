'use strict'

const platziverseAgent = require('../')

const agent = new platziverseAgent({
    name: 'myapp',
    username: 'admin',
    interval: 2000
})

// Resident Set Size (rss) is a data of memory (in teh case of nodeJS, it will be the "rss" property in the "process.memoryUsage" object)
agent.addMetric('rss', function getRss () { 
    return process.memoryUsage().rss
})

// the same as the above but in asynchronous cases
agent.addMetric('promiseMetric', function getRandomPromise () {
    return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallback (callback) {
    setTimeout(() => {
        callback(null, Math.random()) // null porque no hubo un error
    }, 1000)
})

agent.connect()

// Messages of this Agent: Events of this agent only
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

// Messages of other Agents: Events from MQTT server
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

function handler (payload) {
    console.log(payload)
}

setTimeout(() => agent.disconnect(), 20000)