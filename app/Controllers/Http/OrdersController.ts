import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrdersController {
  /**
   *
   * Fetch all of Orders
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {}

  /**
   *
   * Store a Order
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {}

  /**
   *
   * Update a Order
   *
   * @param ctx
   */
  public async update({ request, response }: HttpContextContract) {}

  /**
   *
   * Delete a Order
   *
   * @param ctx
   */
  public async destroy({ request, response }: HttpContextContract) {}
}
