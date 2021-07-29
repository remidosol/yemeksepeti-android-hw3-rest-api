import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Restaurant from 'App/Models/Restaurant'
import Food from 'App/Models/Food'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  afterFind,
  afterFetch,
} from '@ioc:Adonis/Lucid/Orm'

export enum PaymentMethods {
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  COUPON = 'COUPON',
}

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Order:
 *      type: object
 *      properties:
 *        id:
 *          type: uint
 *        userId:
 *          type: uint
 *        restaurantId:
 *          type: uint
 *        orderNote:
 *          type: string
 *        orderPaymentMethod:
 *          type: string
 *          enum:
 *            - CREDIT_CARD
 *            - CASH
 *            - COUPON
 *      required:
 *        - userId
 *        - restaurantId
 *        - orderPaymentMethod
 */
export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'userId' })
  public userId: number

  @column({ serializeAs: 'restaurantId' })
  public restaurantId: number

  @column({ serializeAs: 'orderNote' })
  public orderNote: string

  @column({ serializeAs: 'orderPaymentMethod' })
  public orderPaymentMethod: PaymentMethods

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Restaurant, {
    foreignKey: 'restaurantId',
  })
  public restaurant: BelongsTo<typeof Restaurant>

  @manyToMany(() => Food, {
    localKey: 'id',
    pivotForeignKey: 'order_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'food_id',
    pivotTable: 'pivot_order_foods',
    serializeAs: 'orderFoods',
  })
  public orderFoods: ManyToMany<typeof Food>

  // @afterFind()
  // public static async preloadRestaurantSingle(order: Order) {
  //   try {
  //     await order.load('orderFoods')
  //     await order.load('restaurant')
  //     await order.load('user')
  //   } catch (err) {
  //     console.warn(err.code)
  //     console.warn(err.message)
  //     console.warn(err.stack)
  //   }
  // }

  // @afterFetch()
  // public static async preloadRestaurantMultiple(orders: Order[]) {
  //   try {
  //     for (let order of orders) {
  //       await order.load('orderFoods')
  //       await order.load('restaurant')
  //       await order.load('user')
  //     }
  //   } catch (err) {
  //     console.warn(err.code)
  //     console.warn(err.message)
  //     console.warn(err.stack)
  //   }
  // }
}
