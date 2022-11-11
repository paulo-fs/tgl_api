import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import User from './User'

export default class BetPurshase extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public idUser: string

  @column()
  public idGame: number

  @column()
  public selectedNumbers: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignUuid(user: BetPurshase) {
    user.id = uuidv4()
  }
}
