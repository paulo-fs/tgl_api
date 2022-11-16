import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'app_configurations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unique().notNullable().unsigned().primary()
      table.string('rule', 50).notNullable()
      table.string('value', 50).notNullable()
      table.string('data_type', 50).defaultTo('string')

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
