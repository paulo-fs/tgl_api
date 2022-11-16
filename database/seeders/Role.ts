import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Role.updateOrCreateMany('role', [
      {
        role: 'admin',
      },
      {
        role: 'employee',
      },
      {
        role: 'client',
      },
    ])
  }
}
