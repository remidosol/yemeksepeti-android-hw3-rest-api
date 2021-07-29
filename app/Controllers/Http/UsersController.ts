import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  /**
   *
   * Fetch all of Users
   *
   * @param ctx
   */
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query().preload('profile').preload('userAddresses').preload('orders')

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
   * Store a User
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
