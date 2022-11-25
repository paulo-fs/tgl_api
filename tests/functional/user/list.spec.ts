import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User list', (group) => {
  group.tap((test) => test.tags(['@user_list']))
  const resource = 'api/users'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should a list of users', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(resource).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
    })
  })

  test('should fail with status 403 - forbiden', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(resource).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
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
