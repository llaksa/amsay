'use strict'

const express = require('express')
const expAsyncify = require('express-asyncify')
const request = require('request-promise-native')

const { endpoint, apiToken } = require('./config')
const api = expAsyncify(express.Router())

api.get('/agents', async (req, res, next) => {
    const options = {
        method: 'GET',
        url: `${endpoint}`,
        headers: {
            'Authorization': `Bearer ${apiToken}`
        },
        json: true
    }
    let result
    try {
        result = await request(options)
    } catch (e) {
        return next(e)
    }

    res.send(result)
})

api.get('/agents/:uuid', (req, res) => {})

api.get('/metrics/:uuid', (req, res) => {})

api.get('/metrics/:uuid/:type', (req, res) => {})

module.exports = api

// este archivo:
// cuando hagan una petición a agents vamos a hacer una petición a la api y retornarlo al cliente que pidó la ruta al inicio