import type { FastifyReply, FastifyRequest } from "fastify"
import fastify from "fastify"
import userRoutes from "./modules/user/user.route"
import { userSchemas } from "./modules/user/user.schema"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"

export const app = fastify()

app.register(fastifyCors, {
  origin: true,
  credentials: true
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'some-secret-key'
})

app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token

    if (!token){
      return reply.status(401).send({
        message: 'Authentication required'
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
  hook: 'preHandler'
})

async function main(){
  for (const schema of userSchemas){
    app.addSchema(schema)
  }

  app.register(userRoutes, { 
    prefix: 'api/users'
  })
  
}

main()