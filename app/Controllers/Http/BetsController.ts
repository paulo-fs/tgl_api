import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import Game from 'App/Models/Game'
import AppConfiguration from 'App/Models/AppConfiguration'

import Database from '@ioc:Adonis/Lucid/Database'

export default class BetsController {
  public async index({ auth, response, request }: HttpContextContract) {
    const userId = auth.user?.id
    const { page, perPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) return await Bet.query().where('user_id', userId!).filter(inputs)

    try {
      const bets = await Bet.query()
        .where('user_id', userId!)
        .filter(inputs)
        .paginate(page || 1, perPage || 10)
      return bets
    } catch (error) {
      return response.notFound({ message: 'Error in list bets', originalError: error.message })
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const userId = auth.user?.id
    let minCartValue: number
    let bodyRequest = request.body()
    let betsReadyToBeSaved: Bet[] = []

    try {
      await User.findByOrFail('id', userId)
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }

    try {
      const minCartValueConfig = await AppConfiguration.findByOrFail('rule', 'minCartValue')
      minCartValue = Number(minCartValueConfig.value)
    } catch (error) {
      return response.notFound({ message: 'Configuration not found', originalError: error.message })
    }

    const games: Game[] = await Promise.all(
      bodyRequest.map(async (bet: Bet) => {
        let game: Game
        try {
          game = await Game.findByOrFail('id', bet['game_id'])
        } catch (error) {
          return response.notFound({ message: 'Game not found', originalError: error.message })
        }
        return game
      })
    )

    const totalCart = calcTotalCart()

    if (totalCart < minCartValue) {
      return response.badRequest({
        message: `Insuficient cart total, the minimum value is R$${minCartValue
          .toFixed(2)
          .replace('.', ',')}`,
      })
    }

    await Promise.all(betsReadyToBeSaved)
    betsReadyToBeSaved = bodyRequest.map(async (betItem) => {
      betValidations(betItem)

      const trx = await Database.transaction()
      const bet = new Bet()
      bet.useTransaction(trx)

      try {
        bet.userId = userId!
        bet.gameId = betItem['game_id']
        bet.selectedNumbers = betItem['selected_numbers'].join(',')
        await bet.save()
      } catch (error) {
        trx.rollback()
        return response.badRequest({ message: 'Error in save bets', originalError: error.message })
      }

      await trx.commit()

      return {
        gameId: betItem['game_id'],
        selectedNumbers: betItem['selected_numbers'].join(','),
        game: await Game.findByOrFail('id', betItem['game_id']),
      }
    })

    bodyRequest = bodyRequest.map((item) => {
      const game = games.find((game) => game.id === item['game_id'])
      return {
        selected_numbers: item['selected_numbers'].join(','),
        game_infos: {
          id: game?.id,
          type: game?.type,
          price: game?.price,
          color: game?.color,
        },
      }
    })

    return {
      totalCart: totalCart.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      bets: bodyRequest,
    }

    function betValidations(bet) {
      const game = games.find((game) => game.id === bet['game_id'])
      if (!validSizeOfSelectedNumbers(bet['selected_numbers'], game)) {
        return response.badRequest({ message: 'Invalid amount of numbers selected' })
      }
      if (!validRangeOfSelectedNumbers(bet['selected_numbers'], game)) {
        return response.badRequest({
          message: 'One or more numbers selected is out of range for this game',
        })
      }
      if (!uniqueNumbers(bet['selected_numbers'])) {
        return response.badRequest({ message: 'You cant repeat numbers in a bet' })
      }
    }

    function calcTotalCart() {
      let array = games.map((item) => Number(item.price))
      const total = array.reduce((total: number, current: number) => total + current, 0)
      return total
    }

    function validSizeOfSelectedNumbers(numbers: number[], game) {
      return numbers.length === game.minMaxNumbers
    }

    function validRangeOfSelectedNumbers(numbers: number[], game) {
      numbers.sort((a, b) => a - b)
      const isNotZero = numbers[0] !== 0
      const validRange = numbers[numbers.length - 1] <= game.range
      return isNotZero && validRange
    }

    function uniqueNumbers(numbers: number[]) {
      return numbers.every((item, index) => {
        return index === numbers.indexOf(item)
      })
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    const userId = auth.user?.id
    const betId = params.id

    try {
      const bet = await Bet.query().where('user_id', userId!).andWhere('id', betId).firstOrFail()
      return bet
    } catch (error) {
      return response.notFound({ message: 'Bet not found', originalError: error.message })
    }
  }
}
