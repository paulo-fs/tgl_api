import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessage'

export default class StoreValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    type: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(50),
      rules.unique({ table: 'games', column: 'type' }),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),

    description: schema.string({ trim: true }, []),

    range: schema.number([rules.unsigned(), rules.minLength(1), rules.maxLength(3)]),

    price: schema.number([rules.unsigned()]),

    min_max_numbers: schema.number([rules.unsigned(), rules.minLength(1), rules.maxLength(3)]),

    color: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(7)]),
  })
}
