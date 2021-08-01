import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string(
      // email schema for validating email input
      {
        trim: true,
      },
      [rules.required(), rules.email(), rules.unique({ table: 'users', column: 'email' })]
    ),

    password: schema.string({}, [
      // password schema for validating email input
      rules.required(),
      rules.minLength(8),
      rules.maxLength(16),
      rules.confirmed(),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'email.required': 'You must provide an email.',
    'email.email': 'You must provide a valid email.',
    'email.unique': 'Email is already exists',
    'password.required': 'You must provide a password.',
    'password.confirmed': 'Please confirm your password.',
    'password.minLength':
      'You must provide a password that should be greater or equal than 8 characters.',
    'password.maxLength':
      'You must provide a password that should be less or equal than 16 characters.',
  }
}
