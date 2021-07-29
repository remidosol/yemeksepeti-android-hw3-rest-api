import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'

export default class OrdersController {
  /**
   *
   * Fetch all of Orders
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {
    try {
      const orders = await Order.query().preload('orderFoods').preload('restaurant').preload('user')

      const ordersJSON = JSON.parse(JSON.stringify(orders))

      return response.status(200).json({
        orders: ordersJSON,
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
      })
    }
  }

  /**
   *
   * Find a Food
   *
   * @param ctx
   */
  public async find({ request, response, params }: HttpContextContract) {
    try {
      const orderId = params.order_id

      const order = await Order.findByOrFail('id', orderId)

      await order.load('orderFoods')
      await order.load('restaurant')
      await order.load('user')

      return response.status(200).json({
        order: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
      })
    }
  }

  /**
   *
   * Store a Order
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only([
        'orderNote',
        'orderPaymentMethod',
        'restaurantId',
        'userId',
      ])

      const order = await Order.create({
        ...receivedData,
      })

      await order.save()
      await order.refresh()

      return response.status(200).json({
        message: 'Order has been created.',
        order: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
      })
    }
  }

  /**
   *
   * Update a Order
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const orderId = params.order_id

      const receivedData = request.only([
        'orderNote',
        'orderPaymentMethod',
        'restaurantId',
        'userId',
      ])

      const order = await Order.findByOrFail('id', orderId)

      order.orderNote = receivedData.orderNote
      order.orderPaymentMethod = receivedData.orderPaymentMethod
      order.restaurantId = receivedData.restaurantId
      order.userId = receivedData.userId

      await order.save()
      await order.refresh()

      return response.status(200).json({
        message: 'Order has been updated.',
        order: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
      })
    }
  }

  /**
   *
   * Delete a Order
   *
   * @param ctx
   */
  public async destroy({ request, response, params }: HttpContextContract) {
    try {
      const orderId = params.order_id

      const order = await Order.findByOrFail('id', orderId)

      await order.related('orderFoods').query().delete()
      await order.delete()

      return response.status(200).json({
        message: 'Order has been deleted',
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
      })
    }
  }
}
