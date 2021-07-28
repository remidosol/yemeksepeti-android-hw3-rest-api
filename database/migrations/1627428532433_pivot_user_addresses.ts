import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PivotUserAddresses extends BaseSchema {
  protected tableName = 'pivot_user_addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').notNullable()
      table.integer('address_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
