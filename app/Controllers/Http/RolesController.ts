import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import Role from 'App/Models/Role'
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/Roles/StoreValidator'
import UpdateValidator from 'App/Validators/Roles/UpdateValidator'

export default class RolesController {
  public async index({ response }: HttpContextContract) {
    try {
      const roles = await Role.query().preload('users')
      response.ok(roles)
    } catch (error) {
      return response.badRequest({ message: 'Error in list roles', originalError: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyRequest = request.only(['role'])

    const trx = await Database.transaction()
    const role = new Role()
    role.useTransaction(trx)

    try {
      role.role = bodyRequest.role
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in create a role',
        originalError: error.message,
      })
    }

    await role.save()
    await trx.commit()
    response.ok(role)
  }

  public async show({ params, response }: HttpContextContract) {
    const roleId = params.id

    try {
      const role = await Role.findByOrFail('id', roleId)
      await role.load('users')
      response.ok(role)
    } catch (error) {
      return response.notFound({ message: 'Role not found', originalError: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const roleId = params.id
    const updatedRole = request.only(['role'])
    const userId = request.only(['user_id'])['user_id']
    const removeRelation = request.only(['remove_user'])['remove_user']

    let role: Role
    try {
      role = await Role.findByOrFail('id', roleId)
    } catch (error) {
      return response.notFound({ message: 'Role not found', originalError: error.message })
    }

    try {
      await role.merge(updatedRole).save()
      await role.load('users')
    } catch (error) {
      return response.badRequest({
        message: 'Error in update this role',
        originalError: error.message,
      })
    }

    const conditionToRemoveRelaction = (hasUser) => {
      return hasUser.length > 0 && removeRelation
    }

    const conditionToAddRelaction = (hasUser) => {
      return hasUser.length === 0 && !removeRelation
    }

    if (userId) {
      const related = role.serializeRelations()
      const hasUser = related.users.filter((item: User) => {
        return item.id === userId
      })

      if (conditionToRemoveRelaction(hasUser)) {
        try {
          await role.related('users').detach([userId])
          await role.save()
          await role.load('users')
        } catch (error) {
          return response.badRequest({
            message: 'Error in remove relationship',
            originalError: error.message,
          })
        }
      }

      if (conditionToAddRelaction(hasUser)) {
        try {
          const user = await User.findByOrFail('id', userId)
          await role.related('users').attach([user.id])
          await role.save()
          await role.load('users')
        } catch (error) {
          return response.badRequest({
            message: 'Error in attach a user to this role',
            originalError: error.message,
          })
        }
      }
    }

    response.ok(role)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const roleId = params.id
    let role: Role

    try {
      role = await Role.findByOrFail('id', roleId)
      await role.delete()
      response.ok({ message: 'Role deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Role not found', originalError: error.message })
    }
  }
}
