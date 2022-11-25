import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User delete', (group) => {
  group.tap((test) => test.tags(['@user_delete']))
  const resource = 'api/users'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should delete a user', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.delete(`${resource}/${user!.id}`).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'User deleted successfully',
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.delete(`${resource}/abacdf`).guard('api').loginAs(admin!)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'User not found',
    })
  })

  test('should fail with status 403 - forbiden', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.delete(`${resource}/${user!.id}`).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })
})
