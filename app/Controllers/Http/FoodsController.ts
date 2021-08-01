import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Food from 'App/Models/Food'
import S3 from '@ioc:Services/S3'

export default class FoodsController {
  /**
   *
   * Fetch all of Foods
   *
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      let page = request.input('page')
      const foods = await Food.query().preload('foodRestaurants').paginate(page, 10)

      const foodsJSON = JSON.parse(JSON.stringify(foods))

      for (let food of foodsJSON.data) {
        if (!food.imageUrl.startsWith('http://') || !food.imageUrl.startsWith('https://')) {
          food.imageUrl = 'http://' + food.imageUrl
        }
      }

      return response.status(200).json({
        message: 'Foods have been fetched.',
        data: foodsJSON,
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
   * Find a Food
   *
   * @param ctx
   */
  public async find({ response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const food = await Food.findByOrFail('id', foodId)

      await food.load('foodRestaurants')

      const foodJSON = food.toJSON()

      if (!foodJSON.imageUrl.startsWith('http://') || !foodJSON.imageUrl.startsWith('https://')) {
        foodJSON.imageUrl = 'http://' + foodJSON.imageUrl
      }

      return response.status(200).json({
        message: 'Food has been found.',
        data: foodJSON,
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
   * Store a Food
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only(['name', 'price'])

      const imageFile = request.file('imageUrl')

      const imageUrl = await S3.uploadToBucket(imageFile!, 'foods')

      const food = await Food.create({
        name: receivedData.name,
        price: receivedData.price,
        imageUrl: imageUrl?.url,
      })

      await food.save()
      await food.refresh()

      const foodJSON = food.toJSON()

      if (!foodJSON.imageUrl.startsWith('http://') || !foodJSON.imageUrl.startsWith('https://')) {
        foodJSON.imageUrl = 'http://' + foodJSON.imageUrl
      }

      return response.status(200).json({
        message: 'Food has been created.',
        data: foodJSON,
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
   * Update a Food
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const receivedData = request.only(['name', 'price'])

      const food = await Food.findByOrFail('id', foodId)

      const imageFile = request.file('imageUrl')

      if (imageFile) {
        await S3.deleteFromBucket('foods', food.imageUrl.split('/')[2])

        const imageUrl = await S3.uploadToBucket(imageFile!, 'foods')
        food.imageUrl = imageUrl?.url ? imageUrl?.url : food.imageUrl
      }

      food.name = receivedData.name ? receivedData.name : food.name
      food.price = receivedData.price ? receivedData.price : food.price

      await food.save()
      await food.refresh()

      return response.status(200).json({
        message: 'Food has been updated.',
        data: food.toJSON(),
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
   * Delete a Food
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const foodId = params.food_id

      const food = await Food.findByOrFail('id', foodId)

      await S3.deleteFromBucket('foods', food.imageUrl.split('/')[2])

      await food.delete()

      return response.status(200).json({
        message: 'Food has been deleted',
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
