import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  /**
   *
   * Fetch all of Users
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {}

  /**
   *
   * Store a User
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {}

  /**
   *
   * Update a User
   *
   * @param ctx
   */
  public async update({ request, response }: HttpContextContract) {}

  /**
   *
   * Delete a User
   *
   * @param ctx
   */
  public async destroy({ request, response }: HttpContextContract) {}
}
