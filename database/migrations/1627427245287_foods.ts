import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Foods extends BaseSchema {
  protected tableName = 'foods'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.double('price').notNullable()
      table.string('imageUrl').notNullable()
      table.dateTime('updated_at').nullable()
      table.dateTime('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
