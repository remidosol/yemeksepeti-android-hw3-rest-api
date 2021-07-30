import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  /**
   *
   * Fetch all of Users
   *
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      let page = request.input('page')
      const users = await User.query()
        .preload('profile')
        .preload('userAddresses')
        .preload('orders')
        .paginate(page, 10)

      const usersJSON = JSON.parse(JSON.stringify(users))

      return response.status(200).json({
        users: usersJSON,
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
      const userId = params.user_id

      const user = await User.findByOrFail('id', userId)

      await user.load('profile')
      await user.load('orders')
      await user.load('userAddresses')

      return response.status(200).json({
        user: user.toJSON(),
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
   * Store an User
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const userData = request.only(['email', 'password'])
      const profileData = request.only(['avatarUrl', 'firstName', 'lastName', 'mobileNumber'])

      const user = await User.create({
        email: userData.email,
        password: userData.password,
      })

      await user.related('profile').create({
        ...profileData,
      })

      await user.save()
      await user.load('profile')
      await user.refresh()

      return response.status(200).json({
        message: 'User and its profile has been created.',
        user: user.toJSON(),
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
   * Store an user address.
   *
   * @param ctx
   */
  public async storeUserAddress({ request, response, params }: HttpContextContract) {
    try {
      const userId = params.user_id
      const addressData = request.only([
        'country',
        'city',
        'district',
        'neighborhood',
        'street',
        'latitude',
        'longitude',
      ])

      const user = await User.findByOrFail('id', userId)

      await user.related('userAddresses').create({
        ...addressData,
      })

      await user.save()
      await user.load('profile')
      await user.load('userAddresses')
      await user.refresh()

      return response.status(200).json({
        message: 'Address has been added to user.',
        user: user.toJSON(),
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
   * Give an order.
   *
   * @param ctx
   */
  // public async giveAnOrder({ request, response }: HttpContextContract) {
  //   try {
  //     const receivedData = request.only([
  //       'userId',
  //       'orderNote',
  //       'orderPaymentMethod',
  //       'restaurantId',
  //     ])

  //     const user = await User.findByOrFail('id', receivedData.userId)

  //     await user.related('orders').create({
  //       ...receivedData,
  //     })

  //     await user.save()
  //     await user.load('profile')
  //     await user.load('userAddresses')
  //     await user.load('orders')
  //     await user.refresh()

  //     return response.status(200).json({
  //       message: 'Address has been added to user.',
  //       user: user.toJSON(),
  //     })
  //   } catch (error) {
  //     console.warn(error.message)
  //     console.warn(error.stack)
  //     return response.status(500).json({
  //       message: 'Something went wrong.',
  //     })
  //   }
  // }

  /**
   *
   * Update a User
   *
   * @param ctx
   */
  public async update({ request, response, params }: HttpContextContract) {
    try {
      const userId = params.user_id
      const userData = request.only(['email', 'password'])
      const profileData = request.only(['avatarUrl', 'firstName', 'lastName', 'mobileNumber'])

      let user = await User.findByOrFail('id', userId)

      user = { ...user, ...userData }

      await user.related('profile').updateOrCreate(
        {
          userId: user.id,
        },
        {
          ...profileData,
        }
      )

      await user.save()
      await user.refresh()

      return response.status(200).json({
        message: 'User has been updated.',
        user: user.toJSON(),
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
   * Delete a User
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const userId = params.user_id

      const user = await User.findByOrFail('id', userId)

      await user.related('orders').query().delete()
      await user.related('profile').query().delete()
      await user.related('userAddresses').query().delete()
      await user.delete()

      return response.status(200).json({
        message: 'User has been deleted',
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
