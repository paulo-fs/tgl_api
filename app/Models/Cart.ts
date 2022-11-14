import { DateTime } from 'luxon'

import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Game from './Game'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public idUser: string

  @column()
  public selectedNumbers: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Game, {
    pivotTable: 'cart_games',
  })
  public game: ManyToMany<typeof Game>
}
