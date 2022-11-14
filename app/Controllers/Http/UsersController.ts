import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
import StoreValidator from 'App/Validators/User/StoreValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)
    const bodyUser = request.only(['name', 'email', 'password'])

    const trx = await Database.transaction()
    let userCreated
    try {
      userCreated = await User.create(bodyUser, trx)
    } catch (error) {
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    let user
    try {
      user = await User.query().where('id', userCreated.id).firstOrFail()
    } catch (error) {
      return response.badRequest({ messsage: 'Error in finde user', originalError: error.message })
    }
    response.ok({ user })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
