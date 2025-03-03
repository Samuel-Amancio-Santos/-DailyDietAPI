import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { bestSequence } from '../util/bestSequence'
import { checkReqParams } from '../middlewares/checkReqParams'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createMealsBodySchema = z.object({
      nameOfMeal: z.string(),
      describe: z.string(),
      date: z.coerce.date(),
      isInDiet: z.boolean(),
    })

    const { nameOfMeal, describe, date, isInDiet } =
      createMealsBodySchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      nameOfMeal,
      describe,
      date,
      isInDiet,
      user_id: request.user?.id,
    })

    reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const id = await checkReqParams(request, reply)

    const createEditMealsSchema = z.object({
      nameOfMeal: z.string(),
      describe: z.string(),
      date: z.coerce.date(),
      isInDiet: z.boolean(),
    })
    const { nameOfMeal, describe, date, isInDiet } =
      createEditMealsSchema.parse(request.body)

    await knex('meals').update({ nameOfMeal, describe, date, isInDiet }).where({
      user_id: request.user?.id,
      id,
    })

    reply.status(200).send()
  })
  app.delete('/:id', async (request, reply) => {
    const id = await checkReqParams(request, reply)

    await knex('meals').delete().where({
      user_id: request.user?.id,
      id,
    })
    return reply.status(200).send('usuario deletado')
  })

  app.get('/', async (request) => {
    const meals = await knex('meals')
      .where({
        user_id: request.user?.id,
      })
      .select()

    return { meals }
  })
  app.get('/:id', async (request, reply) => {
    const id = await checkReqParams(request, reply)

    const specificMeal = await knex('meals')
      .where({
        user_id: request.user?.id,
        id,
      })
      .select('nameOfMeal', 'describe', 'isInDiet', 'date')

    return { specificMeal }
  })

  app.get('/metrics', async (request) => {
    const mealsTotal = await knex('meals')
      .where('user_id', request.user?.id)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsTotalResult = Number(mealsTotal?.total ?? 0)

    const mealsTrue = await knex('meals')
      .where('user_id', request.user?.id)
      .andWhere('isInDiet', true)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsTrueCount = mealsTrue?.total ?? 0

    const mealsFalse = await knex('meals')
      .where('user_id', request.user?.id)
      .andWhere('isInDiet', false)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsFalseCount = mealsFalse?.total ?? 0

    const metricsPorcent = parseFloat(
      ((mealsTrueCount / mealsTotalResult) * 100).toFixed(),
    )

    const sequence: number = await bestSequence(request)

    return {
      mealsTotalResult,
      mealsTrueCount,
      mealsFalseCount,
      metricsPorcent,
      sequence,
    }
  })

  app.get('/save-metrics', async (request, reply) => {
    const mealsTotal = await knex('meals')
      .where('user_id', request.user?.id)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsTotalResult = Number(mealsTotal?.total ?? 0)

    const mealsTrue = await knex('meals')
      .where('user_id', request.user?.id)
      .andWhere('isInDiet', true)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsTrueCount = mealsTrue?.total ?? 0

    const mealsFalse = await knex('meals')
      .where('user_id', request.user?.id)
      .andWhere('isInDiet', false)
      .count<{ total: number }[]>('* as total')
      .first()

    const mealsFalseCount = mealsFalse?.total ?? 0

    const metricsPorcent = parseFloat(
      ((mealsTotalResult / mealsTrueCount) * 100).toFixed(),
    )

    const sequence: number = await bestSequence(request)

    await knex('metricsOfUsers').insert({
      id: randomUUID(),
      user_id: request.user?.id,
      meals_total: mealsTotalResult,
      meals_true_count: mealsTrueCount,
      meals_false_count: mealsFalseCount,
      metrics_percentage: metricsPorcent,
      best_sequence: sequence,
    })

    reply.status(200).send()
  })
}
