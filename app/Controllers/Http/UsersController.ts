import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import S3 from '@ioc:Services/S3'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

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

      for (let user of usersJSON.data) {
        if (
          !user.profile.avatarUrl.startsWith('http://') ||
          !user.profile.avatarUrl.startsWith('https://')
        ) {
          user.profile.avatarUrl = 'http://' + user.profile.avatarUrl
        }
      }

      return response.status(200).json({
        message: 'Users have been fetched.',
        data: usersJSON,
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
   * Find a User
   *
   * @param ctx
   */
  public async find({ response, params }: HttpContextContract) {
    try {
      const userId = params.user_id

      const user = await User.findBy('id', userId)

      await user?.load('profile')
      await user?.load('orders')
      await user?.load('userAddresses')

      const userJSON = user?.toJSON()

      if (
        (user?.profile !== null && !user?.profile.avatarUrl.startsWith('http://')) ||
        !user?.profile.avatarUrl.startsWith('https://')
      ) {
        userJSON!.profile.avatarUrl = 'http://' + userJSON?.profile.avatarUrl
      }

      return response.status(200).json({
        message: 'User has been found.',
        data: userJSON,
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
   * Fetch User's orders
   *
   * @param ctx
   */
  public async getOrders({ response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()

      await user?.load('orders')

      const userJSON = user!.toJSON()

      return response.status(200).json({
        message: 'Orders of user that is logged in has been fetched.',
        data: userJSON,
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
   * Store an User
   *
   * @param ctx
   */
  public async store({ request, response }: HttpContextContract) {
    const storeSchema = schema.create({
      email: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.required(), rules.email(), rules.unique({ table: 'users', column: 'email' })]
      ),

      password: schema.string({}, [rules.required()]),
    })

    try {
      const validatedData = await request.validate({
        schema: storeSchema,
        data: request.only(['email', 'password']),
        messages: {
          'email.required': 'You must provide email.',
          'email.email': 'You must provide a valid email.',
          'email.unique': 'This email is already registered.',
          'password.required': 'You must provide a password.',
        },
      })

      const profileData = request.only(['firstName', 'lastName', 'mobileNumber'])

      const avatarFile = request.file('avatarUrl')

      const avatarUrl = await S3.uploadToBucket(avatarFile!, 'users')

      const user = await User.create({
        email: validatedData.email,
        password: validatedData.password,
      })

      await user.related('profile').create({
        ...profileData,
        avatarUrl: avatarUrl?.url,
      })

      await user.save()
      await user.load('profile')

      await user.refresh()

      const userJSON = user.toJSON()

      if (
        !userJSON.profile.avatarUrl.startsWith('http://') ||
        !userJSON.profile.avatarUrl.startsWith('https://')
      ) {
        userJSON.profile.avatarUrl = 'http://' + userJSON.profile.avatarUrl
      }

      return response.status(200).json({
        message: 'User and its profile has been created.',
        data: userJSON,
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
        data: user.toJSON(),
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
  //       error: error,
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
      const profileData = request.only(['firstName', 'lastName', 'mobileNumber'])

      let user = await User.findByOrFail('id', userId)

      await user.load('profile')

      const avatarFile = request.file('avatarUrl')

      if (avatarFile && !user.profile.avatarUrl.startsWith('http')) {
        await S3.deleteFromBucket('users', user.profile.avatarUrl.split('/')[2])
        const avatarUrl = await S3.uploadToBucket(avatarFile!, 'users')
        user.profile.avatarUrl = avatarUrl?.url ? avatarUrl.url : user.profile.avatarUrl
      }

      user.email = userData.email ? userData.email : user.email
      user.password = userData.password ? userData.password : user.password

      user.profile.firstName = profileData.firstName
        ? profileData.firstName
        : user.profile.firstName

      user.profile.lastName = profileData.lastName ? profileData.lastName : user.profile.lastName

      user.profile.mobileNumber = profileData.mobileNumber
        ? profileData.mobileNumber
        : user.profile.mobileNumber

      await user.save()
      await user.refresh()

      await user.related('profile').updateOrCreate(
        {
          userId: user.id,
        },
        {
          ...user.profile,
        }
      )

      await user.save()
      await user.refresh()

      return response.status(200).json({
        message: 'User has been updated.',
        data: user.toJSON(),
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
   * Delete a User
   *
   * @param ctx
   */
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const userId = params.user_id

      const user = await User.findByOrFail('id', userId)

      await user.related('orders').query().delete()
      await user.load('profile')

      if (!user.profile.avatarUrl.startsWith('http')) {
        await S3.deleteFromBucket('users', user.profile.avatarUrl.split('/')[2])
      }

      await user.related('profile').query().delete()
      await user.related('userAddresses').query().delete()
      await user.delete()

      return response.status(200).json({
        message: 'User has been deleted',
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
