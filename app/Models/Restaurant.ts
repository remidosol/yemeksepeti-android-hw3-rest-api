import { DateTime } from 'luxon'
import Food from 'App/Models/Food'
import Address from 'App/Models/Address'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  afterFetch,
  afterFind,
} from '@ioc:Adonis/Lucid/Orm'

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Restaurant:
 *      type: object
 *      properties:
 *        id:
 *          type: uint
 *        name:
 *          type: string
 *        typeOfRestaurant:
 *          type: string
 *      required:
 *        - name
 *
 */
export default class Restaurant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'name' })
  public name: string

  @column({ serializeAs: 'typeOfRestaurant' })
  public typeOfRestaurant: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Food, {
    localKey: 'id',
    pivotForeignKey: 'restaurant_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'food_id',
    pivotTable: 'pivot_restaurant_foods',
    serializeAs: 'restaurantFoods',
  })
  public restaurantFoods: ManyToMany<typeof Food>

  @manyToMany(() => Address, {
    localKey: 'id',
    pivotForeignKey: 'restaurant_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'address_id',
    pivotTable: 'pivot_restaurant_addresses',
    serializeAs: 'restaurantAddress',
  })
  public restaurantAddress: ManyToMany<typeof Address>

  @afterFind()
  public static async preloadRestaurantSingle(restaurant: Restaurant) {
    try {
      await restaurant.load('restaurantAddress')
      await restaurant.load('restaurantFoods')
    } catch (err) {
      console.warn(err.code)
      console.warn(err.message)
      console.warn(err.stack)
    }
  }

  @afterFetch()
  public static async preloadRestaurantMultiple(restaurants: Restaurant[]) {
    try {
      for (let restaurant of restaurants) {
        await restaurant.load('restaurantAddress')
        await restaurant.load('restaurantFoods')
      }
    } catch (err) {
      console.warn(err.code)
      console.warn(err.message)
      console.warn(err.stack)
    }
  }
}
