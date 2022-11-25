import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User update', (group) => {
  group.tap((test) => test.tags(['@user_update']))
  const resource = 'api/users'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should update a user', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.put(`${resource}/${user!.id}`).guard('api').loginAs(admin!).json({
      name: 'Client',
      email: 'client@email.com',
      password: 'secret',
    })

    response.assertStatus(200)
  })

  test('should fail with status 401 - not authorized', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.put(`${resource}/${user!.id}`).json({
      name: 'Client',
      email: 'client@email.com',
      password: 'secret',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
        },
      ],
    })
  })

  test('should fail with status 403 - forbiden', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.put(`${resource}/${user!.id}`).guard('api').loginAs(user!).json({
      name: 'Client',
      email: 'client@email.com',
      password: 'secret',
    })

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client
      .put(`${resource}/bd6aadb0-10dd-4485-9d1c-cfc7c4aa51b3`)
      .guard('api')
      .loginAs(admin!)
      .json({
        name: 'Not found',
        email: 'notfound@email.com',
        password: 'secret',
      })

    response.assertStatus(404)
  })
})
