import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessage'

export default class UpdateValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    type: schema.string.optional({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(50),
      rules.unique({
        table: 'games',
        column: 'type',
        caseInsensitive: true,
        whereNot: { id: this.refs.id },
      }),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),

    description: schema.string.optional({ trim: true }, []),

    range: schema.number.optional([rules.unsigned()]),

    price: schema.number.optional([rules.unsigned()]),

    min_max_numbers: schema.number.optional([rules.unsigned()]),

    color: schema.string.optional({ trim: true }, [rules.minLength(4), rules.maxLength(7)]),
  })
}
