import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('country').notNullable()
      table.string('city').notNullable()
      table.string('district').notNullable()
      table.string('neighborhood').notNullable()
      table.string('street').notNullable()
      table.double('latitude').nullable().defaultTo(null)
      table.double('longitude').nullable().defaultTo(null)
      table.dateTime('updated_at').nullable()
      table.dateTime('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
