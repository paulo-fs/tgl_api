import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.all()
    let user

    try {
      user = await User.query().where('email', email).preload('roles').firstOrFail()
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: Env.get('NODE_ENV') === 'development' ? '' : '45min',
        name: user.name,
      })
      return { token, user }
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }
}
