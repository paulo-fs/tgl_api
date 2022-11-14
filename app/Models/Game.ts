import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Cart from './Cart'
import BetPurshase from './BetPurshase'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public min_max_numbers: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Cart, {
    pivotTable: 'cart_games',
  })
  public cart: ManyToMany<typeof Cart>

  @manyToMany(() => BetPurshase)
  public betPurshase: ManyToMany<typeof BetPurshase>
}
