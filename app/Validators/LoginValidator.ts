import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class LogInValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(
      {
        escape: true,
        trim: true,
      },
      [
        rules.required(),
        rules.email({ allowIpDomain: false }),
        rules.exists({ table: 'users', column: 'email' }),
      ]
    ),
    password: schema.string({}, [rules.required()]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    'email.required': 'You must provide email.',
    'email.email': 'You must provide a valid email.',
    'email.exists': 'Email is not exists',
    'password.required': 'You must provide a password.',
  }
}
