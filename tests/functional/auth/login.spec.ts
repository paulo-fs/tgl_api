import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Auth login', (group) => {
  group.tap((test) => test.tags(['@user_show']))
  const resource = 'api/login'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should be able to login', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'client@email.com',
      password: 'secret',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      token: {},
      user: {},
    })
  })

  test('should fail with status 401 - unauthorized', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'notfound@email.com',
      password: 'secret2',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Email or password invalid',
    })
  })
})
