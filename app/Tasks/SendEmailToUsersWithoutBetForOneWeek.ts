import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

import { sendInviteMail } from 'App/Services/sendInviteMail'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'

export default class SendEmailToUsersWithoutBetForOneWeek extends BaseTask {
  /**
      * qualquer valor
      , separador de lista de valores
      - faixa de valores
      / valores de passo
   */
  public static get schedule() {
    return '01 00 09 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    dayjs.extend(isLeapYear)
    dayjs.locale('pt-br')

    Logger.info('rodou a task')

    try {
      const bets = await Bet.all()
      const currentDate = dayjs().format()

      await Promise.all(
        bets.map(async (item) => {
          const { createdAt } = item
          const dateMoreOneWeek = dayjs(String(createdAt)).add(7, 'd').format()
          const userId = item.userId

          if (dateMoreOneWeek < currentDate) {
            const user = await User.findByOrFail('id', userId)
            await sendInviteMail(user, 'email/inviteToPlay')
            Logger.info(`email enviado para $${user.email}`)
          }
        })
      )
    } catch (error) {
      Logger.info('erro')
    }
  }
}
