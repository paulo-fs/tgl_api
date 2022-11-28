import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Roles list', (group) => {
  group.tap((test) => test.tags(['@roles_index']))
  const resource = 'api/roles'

  test('should show all roles', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.get(resource).guard('api').loginAs(admin!)

    response.assertStatus(200)
    response.assertBodyContains([{}])
  })

  test('should fail with status 403 for non admin', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.get(resource).guard('api').loginAs(user!)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })
})
