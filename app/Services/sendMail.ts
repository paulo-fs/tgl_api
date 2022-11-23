import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export async function sendMail(user: User, template: string): Promise<void> {
  await Mail.send((message) => {
    message
      .from('TGL')
      .to(user.email)
      .subject(`Sendo bem vindo(a) ${user.name}`)
      .htmlView(template, { user })
  })
}
