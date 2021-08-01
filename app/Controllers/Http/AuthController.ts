import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LogInValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  /**
   * Log in
   *
   * @param {HttpContextContract} ctx
   * @returns
   * @memberof AuthController
   */
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LogInValidator)

      try {
        if (!auth.use('api').isAuthenticated) {
          const token = await auth.use('api').attempt(email, password)
          let tokJson = token.toJSON()

          await token.user.load('profile')
          const tokenWithUser = {
            token: tokJson,
            message: 'Logging in is successful',
            data: token.user.toJSON(),
          }

          return response.status(200).json({
            message: 'Logging in is successful',
            data: tokenWithUser,
          })
        } else {
          return response.status(400).json({
            message: 'You already logged in.',
          })
        }
      } catch (error) {
        console.warn(error.message)
        console.warn(error.stack)
        return response.status(500).json({
          message: 'Something went wrong.',
          error: error,
        })
      }
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
      return response.status(400).json({
        messages: error.messages.errors,
        error: error,
      })
    }
  }

  /**
   * Log out
   *
   * @param {HttpContextContract} ctx
   * @returns
   * @memberof AuthController
   */
  public async logout({ auth, response }: HttpContextContract) {
    try {
      if (auth.use('api').isAuthenticated) {
        await auth.use('api').logout()

        return response.status(200).json({
          message: 'Logging out is successful',
        })
      } else {
        return response.status(400).json({
          message: 'You already logged out.',
        })
      }
    } catch (err) {
      console.warn(err.message)
      console.warn(err.stack)
      return response.status(500).json({
        message: 'Something went wrong!',
        error: err,
      })
    }
  }
}
