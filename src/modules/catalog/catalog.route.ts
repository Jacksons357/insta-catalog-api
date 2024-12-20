import { FastifyInstance } from "fastify";
import { $ref } from "./catalog.schema";
import { createProductHandler } from "./catalog.controller";

async function catalogRoutes(fastify: FastifyInstance){
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref('createCatalogSchema'),
        response: {
          201: $ref('catalogResponseSchema')
        }
      }
    },
    createProductHandler
  )
}

export default catalogRoutes