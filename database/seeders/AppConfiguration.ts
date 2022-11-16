import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AppConfiguration from 'App/Models/AppConfiguration'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await AppConfiguration.firstOrCreate({
      rule: 'minCartValue',
      value: '10',
      dataType: 'number',
    })
  }
}
