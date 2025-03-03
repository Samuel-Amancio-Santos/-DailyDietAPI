import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
  })
}
