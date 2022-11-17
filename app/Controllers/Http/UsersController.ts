import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'

import User from 'App/Models/User'
import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) return User.query()

    try {
      const users = await User.query().paginate(page || 1, perPage || 10)
      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'Error in list users', originalError: error.message })
    }
  }

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

  public async show({ params, response }: HttpContextContract) {
    const userId = params.id

    try {
      const user = await User.findByOrFail('id', userId)
      user.load('roles')
      return user
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(UpdateValidator)
    const userId = params.id
    const bodyRequest = request.only(['name', 'email', 'password'])

    try {
      const user = await User.findByOrFail('id', userId)
      await user.merge(bodyRequest).save()
      return user
    } catch (error) {
      return response.badRequest({ message: 'Error in update user', originalError: error.message })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const userId = params.id
    let user: User

    try {
      user = await User.findByOrFail('id', userId)
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }

    try {
      await user.delete()
    } catch (error) {
      return response.badRequest({ message: 'Error in delete user', originalError: error.message })
    }

    return response.ok({ message: 'User deleted successfully' })
  }
}
