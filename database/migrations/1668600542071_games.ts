import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unique().unsigned().primary()
      table.string('type', 50).notNullable()
      table.text('description').notNullable()
      table.integer('range').unsigned().notNullable()
      table.decimal('price', 8, 2).unsigned().notNullable().defaultTo(0)
      table.integer('min_max_numbers').unsigned().notNullable()
      table.string('color', 7).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
