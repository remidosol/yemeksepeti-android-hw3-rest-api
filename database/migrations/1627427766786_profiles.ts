import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('mobile_number').notNullable()
      table.string('avatar_url').nullable().defaultTo('')
      table.dateTime('updated_at').nullable()
      table.dateTime('created_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
