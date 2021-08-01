import { DateTime } from 'luxon'
import Order from 'App/Models/Order'
import Restaurant from 'App/Models/Restaurant'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Food:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        price:
 *          type: number
 *          format: double
 *      required:
 *        - name
 *        - price
 */
export default class Food extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'name' })
  public name: string

  @column({ serializeAs: 'price' })
  public price: number

  @column({ serializeAs: 'imageUrl' })
  public imageUrl: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => Order, {
    localKey: 'id',
    pivotForeignKey: 'food_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'order_id',
    pivotTable: 'pivot_order_foods',
    serializeAs: 'foodOrders',
  })
  public foodOrders: ManyToMany<typeof Order>

  @manyToMany(() => Restaurant, {
    localKey: 'id',
    pivotForeignKey: 'food_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'restaurant_id',
    pivotTable: 'pivot_restaurant_foods',
    serializeAs: 'foodRestaurants',
  })
  public foodRestaurants: ManyToMany<typeof Restaurant>
}
