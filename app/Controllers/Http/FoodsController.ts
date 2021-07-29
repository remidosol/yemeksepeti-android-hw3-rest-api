import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Food from 'App/Models/Food'

export default class FoodsController {
  /**
   *
   * Fetch all of Foods
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {
    try {
      const foods = await Food.query().preload('foodRestaurants')

      const foodsJSON = JSON.parse(JSON.stringify(foods))

      return response.status(200).json({
        foods: foodsJSON,
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
  public async find({ response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const food = await Food.findByOrFail('id', foodId)

      await food.load('foodRestaurants')

      return response.status(200).json({
        food: food.toJSON(),
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
   * Store a Food
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only(['name', 'price', 'imageUrl'])

      const food = await Food.create({
        ...receivedData,
      })

      return response.status(200).json({
        message: 'Food has been created.',
        food: food.toJSON(),
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
   * Update a Food
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const receivedData = request.only(['name', 'price', 'imageUrl'])

      const food = await Food.findByOrFail('id', foodId)

      food.name = receivedData.name
      food.price = receivedData.price
      food.imageUrl = receivedData.imageUrl

      await food.save()
      await food.refresh()

      return response.status(200).json({
        message: 'Food has been updated.',
        food: food.toJSON(),
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
   * Delete a Food
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const food = await Food.findByOrFail('id', foodId)

      await food.delete()

      return response.status(200).json({
        message: 'Food has been deleted',
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
