import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Restaurant from 'App/Models/Restaurant'

export default class RestaurantsController {
  /**
   *
   * Fetch all of Restaurants
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {
    try {
      const restaurants = await Restaurant.query()
        .preload('restaurantAddress')
        .preload('restaurantFoods')

      const restaurantsJSON = JSON.parse(JSON.stringify(restaurants))

      return response.status(200).json({
        restaurants: restaurantsJSON,
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
      const restaurantId = params.restaurant_id

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      await restaurant.load('restaurantAddress')
      await restaurant.load('restaurantFoods')

      return response.status(200).json({
        restaurant: restaurant.toJSON(),
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
   * Store a Restaurant
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only(['name', 'logoUrl', 'typeOfRestaurant'])

      const restaurant = await Restaurant.create({
        ...receivedData,
      })

      await restaurant.save()
      await restaurant.refresh()

      return response.status(200).json({
        message: 'Restaurant has been created.',
        restaurant: restaurant.toJSON(),
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
   * Store a restaurant address.
   *
   * @param ctx
   */
  public async storeRestaurantAddress({ request, response, params }: HttpContextContract) {
    try {
      const restaurantId = params.restaurant_id
      const addressData = request.only([
        'country',
        'city',
        'district',
        'neighborhood',
        'street',
        'latitude',
        'longitude',
      ])

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      await restaurant.related('restaurantAddress').create({
        ...addressData,
      })

      await restaurant.save()
      await restaurant.load('restaurantAddress')
      await restaurant.refresh()

      return response.status(200).json({
        message: 'Address has been added to restaurant.',
        user: restaurant.toJSON(),
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
   * Add food to a restaurant.
   *
   * @param ctx
   */
  public async addFoodToRestaurant({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only(['restaurantId', 'foodId'])

      const restaurant = await Restaurant.findByOrFail('id', receivedData.restaurantId)

      await restaurant.related('restaurantFoods').attach([receivedData.foodId])

      await restaurant.save()
      await restaurant.load('restaurantAddress')
      await restaurant.load('restaurantFoods')
      await restaurant.refresh()

      return response.status(200).json({
        message: 'Food has been added to restaurant.',
        user: restaurant.toJSON(),
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
   * Update a Restaurant
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const restaurantId = params.restaurant_id

      const receivedData = request.only(['name', 'logoUrl', 'typeOfRestaurant'])

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      restaurant.name = receivedData.name
      restaurant.typeOfRestaurant = receivedData.typeOfRestaurant
      restaurant.logoUrl = receivedData.logoUrl

      await restaurant.save()
      await restaurant.refresh()

      return response.status(200).json({
        message: 'Restaurant has been updated.',
        restaurant: restaurant.toJSON(),
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
   * Delete a Restaurant
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const restaurantId = params.restaurant_id

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      await restaurant.related('restaurantAddress').query().delete()
      await restaurant.related('restaurantFoods').query().delete()
      await restaurant.delete()

      return response.status(200).json({
        message: 'Restaurant has been deleted',
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
