import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

test.group('Roles update', (group) => {
  group.tap((test) => test.tags(['@roles_update']))
  const resource = 'api/roles'

  const role = { role: 'suply manager' }

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should update a role name', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.put(`${resource}/3`).guard('api').loginAs(admin!).json(role)

    response.assertStatus(200)
    response.assertBodyContains(role)
  })

  test('should assign a role for a user', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client.put(`${resource}/3`).guard('api').loginAs(admin!).json({
      role: 'client',
      user_id: admin!.id,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      users: [
        {
          id: admin!.id,
        },
      ],
    })
  })

  test('should unasign a role for a user', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const role = await Role.findBy('id', 3)
    await role!.related('users').attach([admin!.id])
    await role?.save()

    const response = await client.put(`${resource}/3`).guard('api').loginAs(admin!).json({
      role: 'client',
      user_id: admin!.id,
      remove_user: true,
    })

    response.assertStatus(200)
    response.assertBodyContains({ users: [{}] })
  })

  test('should fail with status 403 for non-admin users', async ({ client }) => {
    const user = await User.findBy('email', 'client@email.com')
    const response = await client.put(`${resource}/3`).guard('api').loginAs(user!).json(role)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You are not authorized',
    })
  })

  test('should fail with status 422 for invalid role', async ({ client }) => {
    const admin = await User.findBy('email', 'admin@email.com')
    const response = await client
      .put(`${resource}/3`)
      .guard('api')
      .loginAs(admin!)
      .json({ role: 3 })

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
      .put(`${resource}/3`)
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
