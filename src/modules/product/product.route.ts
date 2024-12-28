import type { FastifyInstance } from 'fastify'
import { $ref } from './product.schema'
import { createProductHandler } from './product.controller'

async function productRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema'),
        },
      },
    },
    createProductHandler
  )
}

export default productRoutes
