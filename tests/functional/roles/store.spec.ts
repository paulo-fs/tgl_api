import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Roles store', (group) => {
  group.tap((test) => test.tags(['@roles_store']))
  const resource = 'api/roles'

  const role = { role: 'suply manager' }

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should store a role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.post(resource).guard('api').loginAs(admin!).json(role)

    response.assertStatus(200)
    response.assertBodyContains(role)
  })

  test('should fail with status 403 for non admin', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.post(resource).guard('api').loginAs(user!).json(role)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })

  test('should fail with status 422 for invalid role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.post(resource).guard('api').loginAs(admin!).json({ role: 3 })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'string',
          field: 'role',
          message: 'role field is invalid string',
        },
      ],
    })
  })

  test('should fail with status 422 for non unique role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client
      .post(resource)
      .guard('api')
      .loginAs(admin!)
      .json({ role: 'admin' })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'role',
          message: 'role already exists',
        },
      ],
    })
  })
})
