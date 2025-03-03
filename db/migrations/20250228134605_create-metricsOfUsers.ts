import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('metricsOfUsers', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('meals_total')
    table.integer('meals_true_count')
    table.integer('meals_false_count')
    table.decimal('metrics_percentage', 5, 2)
    table.integer('best_sequence')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('metricsOfUsers')
}
