import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../AppConfiguration'))
    await this.runSeeder(await import('../Game'))
    await this.runSeeder(await import('../Role'))
    await this.runSeeder(await import('../User'))
  }
}
