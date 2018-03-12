'use strict'

const test = require('ava') // Un test runner: para crear pruebas unitarias
const sinon = require('sinon')
const proxyquire = require('proxyquire') // nos permite sobrescribir las funciones obtenidas con require('some-library'), es decir, sobreescribir los modelos para poder hacer las pruebas

const agentFixture = require('./fixtures/agent')

// definiendo un archivo de configuración por defecto
// el cuál no quiero que haga una conexión real a la base de datos
// por lo que se va a utilizar una base de datos de prueba, almacenada en memoria como sqlite
let config = {
    logging: sinon.spy() // deshabilitando loggin porque para la prueba no queremos ni siquiera usar logging
}

let MetricStub = { // objeto fake para ser usado por proxyquirer
    belongsTo: sinon.spy() // solo tiene el método belongsTo porque cuando se declaró el objeto real, se llamó a la función belongsTo() 
}

let id = 1
let uuid = 'yyy-yyy-yyy'
let AgentStub = null // inicializar objeto fake para proxyquire. Como estamos provando varios métodos del agente vamos a querer tener un valor fresco, por lo que el objeto fake Agent se debe crear dentro del beforeEach()
let db = null // dándole un scope global a la variable db
let sandbox = null

let single = Object.assign({}, agentFixture.single) // Para tener una instancia "single", distinta o aparte de la que proporciona agentFixture

let connectedArgs = {
    where: {
        connected: true
    }
}

let usernameArgs = {
    where: {
        username: 'platzi',
        connected: true
    }
}

let uuidArgs = {
    where: {
        uuid // uuid: uuid
    }
}

let newAgent = {
    uuid: '123-123-123',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 0,
    connected: false
}

/* Si queremos verificar que el agente exista
como Agent es el objeto que va a devolver la función de configuración de base de datos (setup.js)
cada vez que corramos setup.js, test() creará una instancia de Agent
este instanciamiento es posible de hacer gracias a que ava.js tiene hooks. 
Hooks quiere decir que se pueden correr funciones antes de cada test() */
test.beforeEach(async () => {
    /* comentando lo que es sin uso de proxyquier
    const setupDatabase = require('../') // index.js
    db = await setupDatabase(config)
    */

    // con proxyquire:
    sandbox = sinon.sandbox.create()
    
    AgentStub = {
        hasMany: sandbox.spy()
    }
   
    // Model create Stub
    AgentStub.create = sandbox.stub()
    AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
        toJSON () { return newAgent }
    }))
    
    // Model update Stub
    AgentStub.update = sandbox.stub()
    AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))
    
    // Model findOne Stub
    AgentStub.findOne = sandbox.stub()
    AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixture.byUuid(uuid)))

    // Model findById Stub
    AgentStub.findById = sandbox.stub()
    AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id))) // sinon nos permite que someFunction.withArgs(X).returns(Y), si someFunction(X) devuelva Y 

    // Model update Stub
    AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

    const setupDatabase = proxyquire('../', { // cuando se llame a '../index.js'
        './models/agent': () => AgentStub, // en lugar de devolver la función exportada de agent.js, devuelve el objeto AgentStub
        './models/metric': () => MetricStub // en lugar de devolver la función exportada de metric.js, devuelve el objeto MetricStub
    })

    db = await setupDatabase(config)

    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW')
    console.log(AgentStub)
    console.log(db)
    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW')
})

test.afterEach(t => {
    sandbox && sinon.sandbox.restore()
})

test('Agent', t => {
    t.truthy(db.Agent, 'Agent service should exists') // que lo de dentro del paréntesis resuelve a verdadero
})

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument shoudl be the MetricModel')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Agent#findById', async t => {
    let agent = await db.Agent.findById(id)

    t.true(AgentStub.findById.called, 'findById should be called on model')
    t.true(AgentStub.findById.calledOnce, 'findById should be called once')
    t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')

    t.deepEqual(agent, agentFixture.byId(id), 'should be the same')
})

test.serial('Agent#createOrUpdate - exists', async t => {
    let agent = await db.Agent.createOrUpdate(single)
    
    t.true(AgentStub.findOne.called, 'findOne should be called on model')
    t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
    t.true(AgentStub.update.calledOnce, 'update should be called once')

    t.deepEqual(agent, single, 'agent should be the same')
})