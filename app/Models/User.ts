import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import Hash from '@ioc:Adonis/Core/Hash'

import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import BetPurshase from './BetPurshase'
import Cart from './Cart'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public isAdmin: boolean

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => BetPurshase)
  public betPurchase: HasMany<typeof BetPurshase>

  @hasOne(() => Cart)
  public cart: HasOne<typeof Cart>

  @hasOne(() => Token)
  public token: HasOne<typeof Token>

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuidv4()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
