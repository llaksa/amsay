'use strict'

const agent = { // se crea un objeto agent
    id: 1,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture',
    username: 'platzi',
    hostname: 'test-host',
    pid: 0,
    connected: true,
    createAt: new Date(),
    updateAt: new Date()
}

const agents = [ // se crean varios objetos a partir del agent y la función extends()
    agent,
    extend(agent, { id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test' }),
    extend(agent, { id: 3, uuid: 'yyy-yyy-yyx' }),
    extend(agent, { id: 4, uuid: 'yyy-yyy-yyz', connected: false, username: 'test' })
]

function extend (obj, values) {
    const clone = Object.assign({}, obj)
    return Object.assign(clone, values)
}

module.exports = { // se exporta un objeto a modo de mocks de base de datos
    single: agent,
    all: agents,
    connected: agents.filter(a => a.connected),
    platzi: agents.filter(a => a.username === 'platzi'),
    byUuid: id => agents.filter(a => a.uuid === id).shift(),
    byId: id => agents.filter(a => a.id === id).shift()
}