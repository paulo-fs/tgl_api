import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessage'

export default class StoreValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    role: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(50),
      rules.unique({ table: 'roles', column: 'role' }),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
  })
}
