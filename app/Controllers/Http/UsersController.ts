import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'

import User from 'App/Models/User'
import StoreValidator from 'App/Validators/User/StoreValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)
    const bodyUser = request.only(['name', 'email', 'password'])

    const trx = await Database.transaction()
    const user = new User()
    user.useTransaction(trx)

    try {
      user.name = bodyUser.name
      user.email = bodyUser.email
      user.password = bodyUser.password
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    await user.save()

    try {
      const roleClient = await Role.findByOrFail('role', 'client')
      console.log('role', roleClient)
      await user.related('roles').attach([roleClient.id], trx)
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    await trx.commit()

    let createdUser
    try {
      createdUser = await User.query().where('email', bodyUser.email).preload('roles').firstOrFail()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ messsage: 'Error in find user', originalError: error.message })
    }

    response.ok({ createdUser })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
