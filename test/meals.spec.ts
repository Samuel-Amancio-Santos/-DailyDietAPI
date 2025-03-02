import { expect, afterAll, beforeAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Users routs tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it.only('Should be able to create a new meal', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`

    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Saaamuel',
        email: uniqueEmail,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')!

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        nameOfMeal: 'Feijoada',
        describe: 'feijoada',
        date: '2024-02-10T08:30:00.000Z',
        isInDiet: false,
      })
      .expect(201)
  })
})
