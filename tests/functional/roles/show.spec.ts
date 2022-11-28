import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Roles show', (group) => {
  group.tap((test) => test.tags(['@roles_show']))
  const resource = 'api/roles'

  test('should show a specific role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/1`).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains({ users: {} })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(`${resource}/notfound`).guard('api').loginAs(admin!)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Role not found',
    })
  })

  test('should fail with status 403 for non admin', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(`${resource}/1`).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })
})
