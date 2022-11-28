import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'

test.group('Bets show', (group) => {
  group.tap((test) => test.tags(['@bets_show']))
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

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should show a specific bet of a user', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    await client.post(resource).guard('api').loginAs(user!).json(betsToBeMade)
    const bet = await Bet.findBy('user_id', user!.id)

    const response = await client.get(`${resource}/${bet!.id}`).guard('api').loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      id: bet!.id,
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')

    const response = await client.get(`${resource}/notfound`).guard('api').loginAs(user!)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Bet not found',
    })
  })

  test('should fail with status 401 - not authorized', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    await client.post(resource).guard('api').loginAs(user!).json(betsToBeMade)
    const bet = await Bet.findBy('user_id', user!.id)

    const response = await client.get(`${resource}/${bet!.id}`)

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
        },
      ],
    })
  })
})
