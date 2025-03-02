import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from './check-sessionId-exists'

export async function checkReqParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await checkSessionIdExists
  const getParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = getParamsSchema.parse(request.params)

  request.params = id

  const idTable = await knex('meals')
    .where('user_id', request.user?.id)
    .select('id')

  const checkIdInTable = idTable.some((id) => id.id === request.params)

  if (!checkIdInTable) {
    return reply.status(401).send('Unauthouzed')
  }

  return id
}
