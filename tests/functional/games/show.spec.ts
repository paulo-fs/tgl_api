import { test } from '@japa/runner'

test.group('Games show', (group) => {
  group.tap((test) => test.tags(['@games_show']))
  const resource = 'api/games'

  test('should show a especific game', async ({ client }) => {
    const response = await client.get(`${resource}/2`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 2,
      type: 'Mega-Sena',
    })
  })

  test('should fail with status 404 - not found', async ({ client }) => {
    const response = await client.get(`${resource}/notfound`)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Game not found',
    })
  })
})
