import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Recover password new password', (group) => {
  group.tap((test) => test.tags(['@user_recover']))
  const resource = 'api/recoverpass'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should save the new password', async ({ client }) => {
    const recover = await client.post(resource).json({
      email: 'client@email.com',
    })
    const token = recover.body().token
    const response = await client.put(`${resource}/${token}`).json({
      password: 'secret2',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Password changed successfully',
    })
  })

  test('should fail with status 422 - invalid password', async ({ client }) => {
    const recover = await client.post(resource).json({
      email: 'client@email.com',
    })
    const token = recover.body().token
    const response = await client.put(`${resource}/${token}`).json({
      password: 'sec',
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

  test('should fail with status 400 - bad request', async ({ client }) => {
    const response = await client.put(`${resource}/23818283818dkjfksk`).json({
      password: 'secret2',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Error in update password',
    })
  })
})
