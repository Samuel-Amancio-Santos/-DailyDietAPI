import { afterAll, beforeAll, describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Users routs tests', () => {
  beforeAll(async () => {
    await app.ready()
  }, Infinity)

  afterAll(async () => {
    await app.close()
  }, Infinity)

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  }, Infinity)

  it('Can create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'samuel',
        email: 's@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})
