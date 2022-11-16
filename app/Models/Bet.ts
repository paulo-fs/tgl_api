import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Game from './Game'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public gameId: number

  @column()
  public selectedNumbers: number[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @hasOne(() => Game)
  public games: HasOne<typeof Game>

  @beforeCreate()
  public static async assignUuid(bet: Bet) {
    bet.id = v4()
  }
}
