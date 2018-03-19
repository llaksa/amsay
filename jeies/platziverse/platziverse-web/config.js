'use strict'

module.exports = {
  endpoint: process.env.API_ENDPOINT || 'http://localhost:5000',
  serverHost: process.env.SERVER_HOST || 'http://localhost:8080',
  apiToken: process.env.API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBsYXR6aSIsImFkbWluIjp0cnVlLCJwZXJtaXNzaW9ucyI6WyJtZXRyaWNzOnJlYWQiXSwiaWF0IjoxNTAyMzkzNDExfQ.XMKKy9sgqA0TDKjCcgA4_784H2wP7RVQocttSTE-RTU'
}

// las variables de entorno que aparecen en los componentes de vue del proyecto serán reemplazadas por estos valores de este archivo gracias al comenado "-g envify" del package json
