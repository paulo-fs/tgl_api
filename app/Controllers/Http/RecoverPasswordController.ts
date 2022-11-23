import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { v4 } from 'uuid'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

import StoreValidator from 'App/Validators/RecoverPass/StoreValidator'
import UpdateValidator from 'App/Validators/RecoverPass/UpdateValidator'
import { sendRecoverPasMail } from 'App/Services/sendRecoverPassMail'

export default class RecoverPasswordController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const { email } = request.body()

    try {
      const user = await User.findByOrFail('email', email)
      const token = v4()
      user.rememberMeToken = token
      await user.save()
      return { user, token }
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const { token } = request.params()
    const { password } = request.body()

    try {
      const user = await User.findByOrFail('rememberMeToken', token)
      const userToken = await Database.query().from('api_tokens').where('user_id', user.id).first()
      user.password = password
      user.rememberMeToken = ''
      await user.save()
      if (userToken) {
        await Database.from('api_tokens').where('user_id', user.id).delete()
      }
      await sendRecoverPasMail(user, 'email/recoverPassword')
      return response.ok({ message: 'Password changed successfully' })
    } catch (error) {
      return response.badRequest({
        message: 'Error in update password',
        originalError: error.message,
      })
    }
  }
}
