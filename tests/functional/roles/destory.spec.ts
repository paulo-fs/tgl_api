import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

test.group('Roles destory', (group) => {
  group.tap((test) => test.tags(['@roles_update']))
  const resource = 'api/roles'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should delete a role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.delete(`${resource}/3`).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Role deleted successfully',
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.delete(`${resource}/notfound`).guard('api').loginAs(admin!)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Role not found',
    })
  })

  test('should fail with status 403 for non admin', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.delete(`${resource}/3`).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })
})
