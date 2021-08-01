import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Restaurant from 'App/Models/Restaurant'
import S3 from '@ioc:Services/S3'

export default class RestaurantsController {
  /**
   *
   * Fetch all of Restaurants
   *
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      let page = request.input('page')

      const restaurants = await Restaurant.query()
        .preload('restaurantAddress')
        .preload('restaurantFoods')
        .paginate(page, 10)

      const restaurantsJSON = JSON.parse(JSON.stringify(restaurants))

      for (let restaurant of restaurantsJSON.data) {
        if (
          !restaurant.logoUrl.startsWith('http://') ||
          !restaurant.logoUrl.startsWith('https://')
        ) {
          restaurant.logoUrl = 'http://' + restaurant.logoUrl
        }
      }

      return response.status(200).json({
        message: 'Restaurants have been fetched.',
        data: restaurantsJSON,
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
      const restaurantId = params.restaurant_id

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      await restaurant.load('restaurantAddress')
      await restaurant.load('restaurantFoods')

      const restaurantJSON = restaurant.toJSON()

      if (
        !restaurantJSON.logoUrl.startsWith('http://') ||
        !restaurantJSON.logoUrl.startsWith('https://')
      ) {
        restaurantJSON.logoUrl = 'http://' + restaurantJSON.logoUrl
      }

      return response.status(200).json({
        message: 'Restaurant has been found.',
        data: restaurant.toJSON(),
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
   * Store a Restaurant
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const receivedData = request.only(['name', 'typeOfRestaurant'])

      const logoFile = request.file('logoUrl')

      const logoUrl = await S3.uploadToBucket(logoFile!, 'restaurants')

      const restaurant = await Restaurant.create({
        name: receivedData.name,
        typeOfRestaurant: receivedData.typeOfRestaurant,
        logoUrl: logoUrl?.url,
      })

      await restaurant.save()
      await restaurant.refresh()

      const restaurantJSON = restaurant.toJSON()

      if (
        !restaurantJSON.logoUrl.startsWith('http://') ||
        !restaurantJSON.logoUrl.startsWith('https://')
      ) {
        restaurantJSON.logoUrl = 'http://' + restaurantJSON.logoUrl
      }

      return response.status(200).json({
        message: 'Restaurant has been created.',
        data: restaurantJSON,
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
        data: restaurant.toJSON(),
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
        data: restaurant.toJSON(),
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
   * Update a Restaurant
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const restaurantId = params.restaurant_id

      const receivedData = request.only(['name', 'typeOfRestaurant'])

      const restaurant = await Restaurant.findByOrFail('id', restaurantId)

      const logoFile = request.file('logoUrl')
      if (logoFile) {
        await S3.deleteFromBucket('restaurants', restaurant.logoUrl.split('/')[2])
        const logoUrl = await S3.uploadToBucket(logoFile!, 'restaurants')
        restaurant.logoUrl = logoUrl?.url ? logoUrl.url : restaurant.logoUrl
      }

      restaurant.name = receivedData.name ? receivedData.name : restaurant.name
      restaurant.typeOfRestaurant = receivedData.typeOfRestaurant
        ? receivedData.typeOfRestaurant
        : restaurant.typeOfRestaurant

      await restaurant.save()
      await restaurant.refresh()

      return response.status(200).json({
        message: 'Restaurant has been updated.',
        data: restaurant.toJSON(),
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

      await S3.deleteFromBucket('restaurants', restaurant.logoUrl.split('/')[2])
      await restaurant.delete()

      return response.status(200).json({
        message: 'Restaurant has been deleted',
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
