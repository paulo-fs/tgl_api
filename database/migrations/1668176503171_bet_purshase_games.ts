import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bet_purshase_games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unique().unsigned()

      table
        .integer('id_bet_purshase')
        .unique()
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('bet_purshases')
        .onDelete('CASCADE')

      table
        .integer('id_game')
        .unique()
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('games')
        .onDelete('CASCADE')

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
