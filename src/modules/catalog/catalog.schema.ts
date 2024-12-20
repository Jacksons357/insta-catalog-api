import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const catalogInput = {
  title: z.string(),
  description: z.string().optional(),
}

const createCatalogSchema = z.object({
  ...catalogInput
})

const catalogResponseSchema = z.object({
  ...catalogInput
})

const catalogsResponseSchema = z.array(catalogResponseSchema)

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>

export const { schemas: catalogSchemas, $ref } = buildJsonSchemas({
  createCatalogSchema,
  catalogResponseSchema,
  catalogsResponseSchema
}, {
  $id: 'catalogSchemas'
})