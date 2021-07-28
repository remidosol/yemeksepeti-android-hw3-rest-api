import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RestaurantsController {
  /**
   *
   * Fetch all of Restaurants
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {}

  /**
   *
   * Store a Restaurant
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {}

  /**
   *
   * Update a Restaurant
   *
   * @param ctx
   */
  public async update({ request, response }: HttpContextContract) {}

  /**
   *
   * Delete a Restaurant
   *
   * @param ctx
   */
  public async destroy({ request, response }: HttpContextContract) {}
}
