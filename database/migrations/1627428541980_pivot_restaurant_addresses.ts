import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PivotRestaurantAddresses extends BaseSchema {
  protected tableName = 'pivot_restaurant_addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('restaurant_id').notNullable()
      table.integer('address_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
