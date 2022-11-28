import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Bets list', (group) => {
  group.tap((test) => test.tags(['@bets_index']))
  const resource = 'api/bets'

  test('should list all bets', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(resource).guard('api').loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {},
      data: [],
    })
  })

  test('should list all bets without paginate', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(resource).guard('api').loginAs(user!).qs({ noPaginate: true })

    response.assertStatus(200)
    response.assertBodyContains([])
  })

  test('should filter by gameId', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(resource).guard('api').loginAs(user!).qs({ gameId: 2 })

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {},
      data: [],
    })
  })

  test('should fail with status 401 - not authorized', async ({ client }) => {
    const response = await client.get(resource)

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
