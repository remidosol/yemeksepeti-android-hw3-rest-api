import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PivotOrderFoods extends BaseSchema {
  protected tableName = 'pivot_order_foods'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('order_id').notNullable()
      table.integer('food_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
