import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export async function sendInviteMail(user: User, template: string): Promise<void> {
  await Mail.send((message) => {
    message
      .from('TGL')
      .to(user.email)
      .subject(`Sentimos sua falta ${user.name}`)
      .htmlView(template, { user })
  })
}
