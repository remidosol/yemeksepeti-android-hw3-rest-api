import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Profile from 'App/Models/Profile'
import Order from 'App/Models/Order'
import Address from 'App/Models/Address'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

/**
 *  @swagger
 *  components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *      required:
 *        - email
 *        - password
 */
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'email' })
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public remember_me_token: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasOne(() => Profile, {})
  public profile: HasOne<typeof Profile>

  @hasMany(() => Order, {})
  public orders: HasMany<typeof Order>

  @manyToMany(() => Address, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'address_id',
    pivotTable: 'pivot_user_addresses',
    serializeAs: 'userAddresses',
  })
  public userAddresses: ManyToMany<typeof Address>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
