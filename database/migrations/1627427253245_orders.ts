import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PaymentMethods } from 'App/Models/Order'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.integer('restaurant_id').notNullable()
      table.string('order_note').nullable()
      table
        .enum('order_payment_method', [
          PaymentMethods.CASH,
          PaymentMethods.COUPON,
          PaymentMethods.CREDIT_CARD,
        ])
        .notNullable()
      table.dateTime('updated_at').nullable()
      table.dateTime('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
