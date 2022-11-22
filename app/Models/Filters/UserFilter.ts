import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  public name(value: string) {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  public email(value: string) {
    this.$query.where('email', 'LIKE', `%${value}%`)
  }

  public createdAt(value: string) {
    this.$query.where('created_at', 'LIKE', `%${value}%`)
  }
}
