import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GamesController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
