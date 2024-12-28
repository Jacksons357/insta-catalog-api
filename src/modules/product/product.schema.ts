import { buildJsonSchemas } from 'fastify-zod'
import z from 'zod'

const productInput = {
  image: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  catalogId: z.string().uuid(),
}

const createProductSchema = z.object({
  ...productInput,
})

const productResponseSchema = z.object({
  ...productInput,
})

const productsResponseSchema = z.array(productResponseSchema)

export type CreateProductInput = z.infer<typeof createProductSchema>

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  {
    $id: 'productSchemas',
  }
)
