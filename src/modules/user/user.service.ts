import { hashPassword } from "../../utils/hash"
import prisma from "../../utils/prisma"
import type { CreateUserInput } from "./user.schema"

export async function createUser(input: CreateUserInput){
  const { password, name, email } = input

  const nameFormatted = name.toLowerCase()
  const emailFormatted = email.toLowerCase()

  const { hash, salt } = hashPassword(password)

  const user = await prisma.user.create({
    data: {
      salt,
      email: emailFormatted,
      name: nameFormatted,
      password: hash}
  })

  return user
}

export async function findUserByEmail(email: string){
  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })

  return user
}

export async function getUsers(){
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  })
}