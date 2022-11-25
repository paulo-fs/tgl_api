import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('User store', (group) => {
  group.tap((test) => test.tags(['@user_store']))
  const resource = 'api/users'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a user successfully', async ({ client }) => {
    const response = await client.post(resource).json({
      name: 'Fulano',
      email: 'fulano@email.com',
      password: 'secret',
    })

    response.assertStatus(200)
  })

  test('should fail with status 422 - email alread exists', async ({ client }) => {
    const response = await client.post(resource).json({
      name: 'Admin',
      email: 'admin@email.com',
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'email',
          message: 'email already exists',
        },
      ],
    })
  })

  test('should fail with status 422 - invalid name', async ({ client }) => {
    const response = await client.post(resource).json({
      name: 22,
      email: 'teste@email.com',
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'string',
          field: 'name',
          message: 'name field is invalid string',
        },
      ],
    })
  })

  test('should fail with status 422 - invalid email', async ({ client }) => {
    const response = await client.post(resource).json({
      name: 'teste',
      email: 'testeemail.com',
      password: 'secret',
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

  test('should fail with status 422 - invalid password', async ({ client }) => {
    const response = await client.post(resource).json({
      name: 'teste',
      email: 'teste@email.com',
      password: 'se',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'minLength',
          field: 'password',
          message: 'password field must be at least 5',
          args: {
            minLength: 5,
          },
        },
      ],
    })
  })
})
