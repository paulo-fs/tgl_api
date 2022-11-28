import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Games store', (group) => {
  group.tap((test) => test.tags(['@games_store']))
  const resource = 'api/games'

  const game = {
    type: 'Lotomania',
    description:
      "'Escolha 10 números dos 80 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',",
    range: 80,
    price: 3.0,
    min_max_numbers: 10,
    color: '#FFA500',
  }

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should store a game', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.post(resource).guard('api').loginAs(admin!).json(game)

    response.assertStatus(200)
    response.assertBodyContains({
      game: {},
    })
  })

  test('should fail with status 422 when a field is missin', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.post(resource).guard('api').loginAs(admin!).json({
      type: 'Lotomania Teste Novo',
      description:
        "'Escolha 10 números dos 80 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',",
      range: 80,
      min_max_numbers: 10,
      color: '#FFA500',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: {},
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
})
