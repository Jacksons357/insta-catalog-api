import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateProductInput } from './product.schema'
import { createProduct } from './product.service'

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput
  }>,
  reply: FastifyReply
) {
  const product = await createProduct(request.body)

  return reply.status(201).send(product)
}
