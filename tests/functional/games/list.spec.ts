import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Games list', (group) => {
  group.tap((test) => test.tags(['@games_index']))
  const resource = 'api/games'

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should list all games', async ({ client }) => {
    const response = await client.get(resource)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {},
      data: [],
    })
  })

  test('should list games without paginate', async ({ client }) => {
    const response = await client.get(resource).qs({
      noPaginate: true,
    })

    response.assertStatus(200)
    response.assertBodyContains([{}])
  })
})
