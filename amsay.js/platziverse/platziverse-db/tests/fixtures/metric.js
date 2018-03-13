'use strict'

const agentFixture = require('./agent')

const metric = { // se crea un objeto metric
    id: 1,
    type: 'typea',
    value: '753',
    agentId: 1,
    createAt: new Date()
}

const metrics = [ // se crean varios objetos a partir del metric y la función extends()
    metric,
    extend(metric, { id: 2, type: 'typeb', value: '753', agentId: 4 }),
    extend(metric, { id: 3, value: '123' }),
    extend(metric, { id: 4, type: 'typec', agentId: 3 }),
    extend(metric, { id: 5, type: 'typeb', value: '123' })
]

function extend (obj, values) {
    const clone = Object.assign({}, obj)
    return Object.assign(clone, values)
}

module.exports = { // se exporta un objeto a modo de mocks de base de datos
    single: metric,
    all: metrics,
    byAgentUuid: uuid => metrics.filter(a => { 
        agentFixture.byId(a.agentId).uuid === uuid
    }).shift(),
    byTypeAgentUuid: (type, Uuid) => metrics.filter(a => {
        (agentFixture.byId(a.agentId).uuid === uuid) && (a.type === type)
    }).shift()
}