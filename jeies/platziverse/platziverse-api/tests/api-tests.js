'use strict'

const debug = require('debug')('platziverse:api:tests')
const test = require('ava')
const util = require('util')
const supertest = require('supertest') // toma a server.js como una instancia, no necesita que el servidor http esté corriendo
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('../../platziverse-common/tests/fixtures/agent')
const configSetup = require('../../platziverse-common/defaultConfig')
const auth = require('../auth') // como auth es una función asíncrona, que tiene un callback, lo vamos a promisificar con util
const sign = util.promisify(auth.sign) // aquí ya tenemos esta función de firmado como una función asíncrona

const config = configSetup({logging: s => debug(s)})

let sandbox = null
let server = null
let dbStub = null
let token = null
let AgentStub = {}
let MetricStub = {}

// definiendo un hook para antes de los tests
test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  token = await sign({ admin: true, username: 'platzi' }, config.auth.secret)

  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test.serial.cb('/api/agents', t => { // podríamos usar solamente test.serial con async / await, pero como estamos usando supertestJS, debemos usar test.serial.cb porque es su forma de trabajar
  supertest(server) // pasamos una instancia del servidor a supertest para hacer una petición y tener respuestas esperadas
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end() // solo es necesario cuando se usa un test tipo callback
    })
})

test.serial.todo('/api/agents - not authorized')
test.serial.todo('/api/agent/:uuid')
test.serial.todo('/api/agent/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not found')