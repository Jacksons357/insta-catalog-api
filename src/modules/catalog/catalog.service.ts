import prisma from '@/utils/prisma'
import type { CreateCatalogInput } from './catalog.schema'

export async function createCatalog(
  data: CreateCatalogInput & {
    ownerId: string
  }
) {
  return prisma.catalog.create({
    data,
  })
}
