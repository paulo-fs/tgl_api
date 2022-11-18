import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import StoreValidator from 'App/Validators/Game/StoreValidator'
import UpdateValidator from 'App/Validators/Game/UpdateValidator'

import Game from 'App/Models/Game'

export default class GamesController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) return Game.query()

    try {
      const games = await Game.query().paginate(page || 1, perPage || 10)
      return response.ok(games)
    } catch (error) {
      return response.badRequest({ message: 'Error in list games', originalError: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyRequest = await request.only([
      'type',
      'description',
      'range',
      'price',
      'min_max_numbers',
      'color',
    ])

    const trx = await Database.transaction()
    const game = new Game()
    game.useTransaction(trx)

    try {
      game.type = bodyRequest.type
      game.description = bodyRequest.description
      game.range = bodyRequest.range
      game.price = bodyRequest.price
      game.minMaxNumbers = bodyRequest.min_max_numbers
      game.color = bodyRequest.color
      await game.save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    await trx.commit()
    response.ok({ game })
  }

  public async show({ params, response }: HttpContextContract) {
    const gameId = params.id

    try {
      const game = await Game.findByOrFail('id', gameId)
      response.ok(game)
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const gameId = params.id
    const bodyRequest = request.only([
      'type',
      'description',
      'range',
      'price',
      'min_max_numbers',
      'color',
    ])

    let gameToBeUpdated: Game
    try {
      gameToBeUpdated = await Game.findByOrFail('id', gameId)
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }

    try {
      await gameToBeUpdated.merge(bodyRequest).save()
      return gameToBeUpdated
    } catch (error) {
      return response.badRequest({
        message: 'Error in update this game',
        originalError: error.message,
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const gameId = params.id

    try {
      const gameToBeDeleted = await Game.findByOrFail('id', gameId)
      gameToBeDeleted.delete()
      response.ok({ message: 'Game deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }
  }
}
