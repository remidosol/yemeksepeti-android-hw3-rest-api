import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'

export default class OrdersController {
  /**
   *
   * Fetch all of Orders
   *
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      let page = request.input('page')

      const orders = await Order.query()
        .preload('orderFoods')
        .preload('restaurant')
        .preload('user')
        .paginate(page, 10)

      const ordersJSON = JSON.parse(JSON.stringify(orders))

      return response.status(200).json({
        message: 'Orders have been fetched.',
        data: ordersJSON,
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
        error: error,
      })
    }
  }

  /**
   *
   * Find a Order
   *
   * @param ctx
   */
  public async find({ response, params }: HttpContextContract) {
    try {
      const orderId = params.order_id

      const order = await Order.findByOrFail('id', orderId)

      await order.load('orderFoods')
      await order.load('restaurant')
      await order.load('user')

      return response.status(200).json({
        message: 'Order has been found.',
        data: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
        error: error,
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
      await order.load('user', (query) => query.preload('profile'))
      await order.refresh()

      return response.status(200).json({
        message: 'Order has been created.',
        data: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
        error: error,
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
        data: order.toJSON(),
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
        error: error,
      })
    }
  }

  /**
   *
   * Delete a Order
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const orderId = params.order_id

      const order = await Order.findByOrFail('id', orderId)

      await order.related('orderFoods').query().delete()
      await order.delete()

      return response.status(200).json({
        message: 'Order has been deleted',
        data: {},
      })
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(500).json({
        message: 'Something went wrong.',
        error: error,
      })
    }
  }
}
