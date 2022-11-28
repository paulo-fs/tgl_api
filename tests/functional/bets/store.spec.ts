import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'

test.group('Bets store', (group) => {
  group.tap((test) => test.tags(['@bets_store']))
  const resource = 'api/bets'
  const betsToBeMade = [
    {
      game_id: 3,
      selected_numbers: [1, 10, 7, 4, 5],
    },
    {
      game_id: 2,
      selected_numbers: [1, 10, 4, 5, 20, 60],
    },
    {
      game_id: 3,
      selected_numbers: [1, 10, 4, 5, 43],
    },
    {
      game_id: 2,
      selected_numbers: [7, 15, 32, 21, 43, 54],
    },
    {
      game_id: 3,
      selected_numbers: [1, 10, 4, 5, 43],
    },
  ]
  const insuficientBetsToStore = [
    {
      game_id: 3,
      selected_numbers: [1, 10, 7, 4, 5],
    },
    {
      game_id: 2,
      selected_numbers: [1, 10, 4, 5, 20, 60],
    },
  ]
  const betWithInvalidAmountOfNumbers = [
    {
      game_id: 3,
      selected_numbers: [1, 10, 7, 4, 5, 11, 19],
    },
    {
      game_id: 2,
      selected_numbers: [1, 10, 4, 5, 20, 60],
    },
    {
      game_id: 3,
      selected_numbers: [1, 10, 4, 5, 43],
    },
    {
      game_id: 2,
      selected_numbers: [7, 15, 32, 21, 43, 54],
    },
    {
      game_id: 3,
      selected_numbers: [1, 10, 4, 5, 43],
    },
  ]

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should store bets of a user', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')

    const response = await client.post(resource).guard('api').loginAs(user!).json(betsToBeMade)

    response.assertStatus(200)
    response.assertBodyContains({
      bets: [{}],
    })
  })

  test('should fail with status 400 for bets under the min_cart_value', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')

    const response = await client
      .post(resource)
      .guard('api')
      .loginAs(user!)
      .json(insuficientBetsToStore)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Insuficient cart total, the minimum value is R$10,00',
    })
  })

  test('should fail with status 400 for bets with invalid amount of selected numbers', async ({
    client,
  }) => {
    const user = await User.findBy('email', 'client@email.com')

    const response = await client
      .post(resource)
      .guard('api')
      .loginAs(user!)
      .json(betWithInvalidAmountOfNumbers)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Invalid amount of numbers selected',
    })
  })
})
