import prisma from '@/utils/prisma'
import type { CreateProductInput } from './product.schema'

export async function createProduct(
  data: CreateProductInput & { catalogId: string }
) {
  return prisma.product.create({
    data,
  })
}
