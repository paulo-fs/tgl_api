import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import Game from 'App/Models/Game'
import AppConfiguration from 'App/Models/AppConfiguration'

import StoreValidator from 'App/Validators/Bet/StoreValidator'

export default class BetsController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const requestBody = request.only(['user_id', 'game_id', 'selected_numbers'])
    let user: User
    let game: Game
    let minCartValue: number

    try {
      user = await User.findByOrFail('id', requestBody['user_id'])
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }

    try {
      game = await Game.findByOrFail('id', requestBody['game_id'])
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }

    try {
      const minCartValueConfig = await AppConfiguration.findByOrFail('rule', 'minCartValue')
      minCartValue = Number(minCartValueConfig.value)
      response.ok([user, game, minCartValue])
    } catch (error) {
      return response.notFound({ message: 'Configuration not found', originalError: error.message })
    }
  }

  public async show({}: HttpContextContract) {}
}
