import fastifySecureSession, { SecureSessionPluginOptions } from '@fastify/secure-session'
import fp from 'fastify-plugin'
import fs from 'fs'
import path from 'path'

export default fp<SecureSessionPluginOptions>(async (fastify, _opts) => {
  fastify.register(fastifySecureSession, { key: fs.readFileSync(path.join(__dirname, '..', '..', 'session.key')) })
}, {
  name: 'secure-session',
})
