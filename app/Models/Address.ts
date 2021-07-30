import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Restaurant from 'App/Models/Restaurant'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'country' })
  public country: string

  @column({ serializeAs: 'city' })
  public city: string

  @column({ serializeAs: 'district' })
  public district: string

  @column({ serializeAs: 'neighborhood' })
  public neighborhood: string

  @column({ serializeAs: 'street' })
  public street: string

  @column({ serializeAs: 'latitude' })
  public latitude: number | undefined

  @column({ serializeAs: 'longitude' })
  public longitude: number | undefined

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'address_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'pivot_user_addresses',
    serializeAs: 'addressOfUsers',
  })
  public addressOfUsers: ManyToMany<typeof User>

  @manyToMany(() => Restaurant, {
    localKey: 'id',
    pivotForeignKey: 'address_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'restaurant_id',
    pivotTable: 'pivot_restaurant_addresses',
    serializeAs: 'addressOfRestaurant',
  })
  public addressOfRestaurant: ManyToMany<typeof Restaurant>
}
