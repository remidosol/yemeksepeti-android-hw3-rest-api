import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FoodsController {
  /**
   *
   * Fetch all of Foods
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {}

  /**
   *
   * Store a Food
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {}

  /**
   *
   * Update a Food
   *
   * @param ctx
   */
  public async update({ request, response }: HttpContextContract) {}

  /**
   *
   * Delete a Food
   *
   * @param ctx
   */
  public async destroy({ request, response }: HttpContextContract) {}
}
