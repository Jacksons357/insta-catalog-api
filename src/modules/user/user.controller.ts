import type { FastifyReply, FastifyRequest } from "fastify"
import type { CreateUserInput, LoginInput } from "./user.schema"
import { createUser, findUserByEmail, getUsers } from "./user.service"
import { verifyPassword } from "../../utils/hash"

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>, 
  reply: FastifyReply
){
  const body = request.body

  try {
    const user = await createUser(body)

    return reply.status(201).send(user)
  } catch (error){
    console.error(error)

    reply.status(500).send({
      message: 'Error to create user',
      error: error
    })
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
){
  const body = request.body

  const user = await findUserByEmail(body.email)

  if(!user){
    return reply.status(401).send({
      message: 'Invalid email address. Try again!'
    })
  }

  const isValidPasword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  })

  if (!isValidPasword){
    return reply.status(401).send({
      message: 'Password is incorrect'
    })
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  }

  const token = request.jwt.sign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // for a week
    httpOnly: true,
    secure: true
  })

  return { accessToken: token }
}

export async function getUsersHandler() {
  const users = await getUsers()

  return users
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
){
  reply.clearCookie('access_token')

  return reply.status(201).send({ message: 'Logout successfully '})
}