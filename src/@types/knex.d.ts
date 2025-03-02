// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id: string
      name: string
      email: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      nameOfMeal: string
      describe: string
      isInDiet: boolean
      date: Date
      created_at: string
      updated_at: string
      user_id: string
    }
    metricsOfUsers: {
      id: string
      user_id: string
      meals_total: number
      meals_true_count: number
      meals_false_count: number
      metrics_percentage: number
      best_sequence: number
      created_at: string
    }
  }
}
