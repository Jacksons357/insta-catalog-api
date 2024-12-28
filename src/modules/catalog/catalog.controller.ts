import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateCatalogInput } from './catalog.schema'
import { createCatalog } from './catalog.service'

export async function createProductHandler(
  request: FastifyRequest<{ Body: CreateCatalogInput }>,
  reply: FastifyReply
) {
  const catalog = await createCatalog({
    ...request.body,
    ownerId: request.user.id,
  })

  return catalog
}
