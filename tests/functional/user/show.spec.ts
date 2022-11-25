import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User show', (group) => {
  group.tap((test) => test.tags(['@user_show']))
  const resource = 'api/users'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should show a user and its bets', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/${admin!.id}`).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains({
      bets: [],
    })
  })

  test('should fail with status 401 - not authorized', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/${admin!.id}`)

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
    const response = await client.get(`${resource}/${user!.id}`).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })

  test('should fail with status 401 - not authorized', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/${admin!.id}`)

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
        },
      ],
    })
  })

  test('should fail with status 404 - user not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/1234123`).guard('api').loginAs(admin!)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'User not found',
    })
  })
})
