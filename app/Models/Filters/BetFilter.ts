import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Bet from 'App/Models/Bet'

export default class BetFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Bet, Bet>

  public gameId(valule: number) {
    this.$query.where('game_id', `%${valule}%`)
  }

  public createdAt(value: string) {
    this.$query.where('created_at', 'LIKE', `%${value}%`)
  }
}
