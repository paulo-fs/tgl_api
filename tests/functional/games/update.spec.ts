import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Games update', (group) => {
  group.tap((test) => test.tags(['@games_update']))
  const resource = 'api/games'

  const game = {
    description:
      'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
    range: 25,
    price: '2.50',
    min_max_numbers: 15,
  }

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should store a game', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.put(`${resource}/1`).guard('api').loginAs(admin!).json(game)

    response.assertStatus(200)
    response.assertBodyContains(game)
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client
      .put(`${resource}/notfound`)
      .guard('api')
      .loginAs(admin!)
      .json(game)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Game not found',
    })
  })

  test('should fail with status 403 for non admins', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.post(resource).guard('api').loginAs(user!).json(game)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })

  test('should fail with status 422 when a game type is equal to another one', async ({
    client,
  }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.put(`${resource}/1`).guard('api').loginAs(admin!).json({
      type: 'Quina',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'type',
          message: 'type already exists',
        },
      ],
    })
  })
})
