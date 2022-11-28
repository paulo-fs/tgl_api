import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Auth recover password', (group) => {
  group.tap((test) => test.tags(['@user_recover']))
  const resource = 'api/recoverpass'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a recover token', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'client@email.com',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user: {},
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'notfound@email.com',
    })

    response.assertStatus(404)
  })

  test('should fail with status 422 - invalid email', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'invalidemail.com',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'email',
          field: 'email',
          message: 'email field should be a valid email',
        },
      ],
    })
  })
})
