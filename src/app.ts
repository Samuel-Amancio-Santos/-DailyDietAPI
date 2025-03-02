import fastify from 'fastify'
import cookies from '@fastify/cookie'
import { usersRoutes } from './routes/usersRoutes'
import { mealsRoutes } from './routes/mealsRoutes'

export const app = fastify()

app.register(cookies)
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: '/meals',
})
