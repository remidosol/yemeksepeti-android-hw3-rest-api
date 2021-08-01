import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Profile:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        userId:
 *          type: number
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        avatarUrl:
 *          type: string
 *        mobileNumber:
 *          type: string
 *      required:
 *        - firstName
 *        - lastName
 */
export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'userId' })
  public userId: number

  @column({ serializeAs: 'firstName' })
  public firstName: string

  @column({ serializeAs: 'lastName' })
  public lastName: string

  @column({ serializeAs: 'avatarUrl' })
  public avatarUrl: string

  @column({ serializeAs: 'mobileNumber' })
  public mobileNumber: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>
}
