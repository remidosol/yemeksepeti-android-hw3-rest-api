import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PivotRestaurantFoods extends BaseSchema {
  protected tableName = 'pivot_restaurant_foods'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('restaurant_id').notNullable()
      table.integer('food_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
