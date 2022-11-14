import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Game from './Game'

export default class BetPurshase extends BaseModel {
  @column({ isPrimary: true })
  public id: string

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Game)
  public game: ManyToMany<typeof Game>

  @beforeCreate()
  public static assignUuid(user: BetPurshase) {
    user.id = uuidv4()
  }
}
