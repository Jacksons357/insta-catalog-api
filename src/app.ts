import type { FastifyReply, FastifyRequest } from 'fastify'
import fastify from 'fastify'
import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import { catalogSchemas } from './modules/catalog/catalog.schema'
import catalogRoutes from './modules/catalog/catalog.route'
import { productSchemas } from './modules/product/product.schema'
import productRoutes from './modules/product/product.route'

export const app = fastify()

app.register(fastifyCors, {
  origin: true,
  credentials: true,
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'some-secret-key',
})

app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token

    if (!token) {
      return reply.status(401).send({
        message: 'Authentication required',
      })
    }

    const decoded = request.jwt.verify(token)

    request.user = decoded
  }
)

app.addHook('preHandler', (req, _, next) => {
  req.jwt = app.jwt
  return next()
})

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'some-secret-key',
  hook: 'preHandler',
})

async function main() {
  for (const schema of [...userSchemas, ...catalogSchemas, ...productSchemas]) {
    app.addSchema(schema)
  }

  app.register(userRoutes, {
    prefix: 'api/users',
  })

  app.register(catalogRoutes, {
    prefix: 'api/catalogs',
  })

  app.register(productRoutes, {
    prefix: 'api/products',
  })
}

main()
