import { FastifyRequest } from 'fastify'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

export const bestSequence = async (request: FastifyRequest) => {
  await checkSessionIdExists
  const bestSequence = await knex('meals').where({
    user_id: request.user?.id,
  })

  let count = 0
  const numberValue: number = 1
  for (let i = bestSequence.length - 1; i >= 0; i--) {
    // Go through the array in reverse order, incrementing by +1 for all true values. If it encounters a false, it will stop the counter.
    if (Number(bestSequence[i].isInDiet) === numberValue) {
      count++
    } else {
      break
    }
  }

  return count
}
