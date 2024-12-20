import prisma from "@/utils/prisma";
import { CreateCatalogInput } from "./catalog.schema";

export async function createCatalog(
  data: CreateCatalogInput & {
    ownerId: string
  }
){
  return prisma.catalog.create({
    data
  })
}