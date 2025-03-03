import { expect, afterAll, beforeAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

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

  it('Should be able to create a new meal', async () => {
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
  it('Should be able to edit a specific meal', async () => {
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

    const listMealsId = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const getMealsId = listMealsId.body.meals[0].id

    await request(app.server)
      .put(`/meals/${getMealsId}`)
      .set('Cookie', cookies)
      .send({
        nameOfMeal: 'Salada',
        describe: 'Com alface',
        date: '2024-02-10T08:20:00.000Z',
        isInDiet: true,
      })
      .expect(200)

    const getSpecificMeals = await request(app.server)
      .get(`/meals/${getMealsId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getSpecificMeals.body.specificMeal[0]).toEqual(
      expect.objectContaining({
        nameOfMeal: 'Salada',
        date: expect.any(Number), // Para lidar com a conversão de datas
        describe: 'Com alface',
        isInDiet: 1,
      }),
    )
  })
  it('should be able to delete a specific meal', async () => {
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

    const listMealsId = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const getMealsId = listMealsId.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${getMealsId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
  it('should be able to list All meals', async () => {
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

    await request(app.server).get('/meals').set('Cookie', cookies).expect(200)
  })
  it('should be able to list a specific meal', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`

    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Samuel',
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

    const listMealsId = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const getMealsId = listMealsId.body.meals[0].id

    await request(app.server)
      .get(`/meals/${getMealsId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
  it('should be able to see metrics of a specific users', async () => {
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

    const metrics = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    console.log(metrics.body)
  })
})
