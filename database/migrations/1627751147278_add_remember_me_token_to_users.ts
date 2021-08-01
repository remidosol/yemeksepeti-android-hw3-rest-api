import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddRememberMeTokenToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('remember_me_token').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('remember_me_token')
    })
  }
}
