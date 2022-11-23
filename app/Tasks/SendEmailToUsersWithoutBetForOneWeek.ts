import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

import Bet from 'App/Models/Bet'

export default class SendEmailToUsersWithoutBetForOneWeek extends BaseTask {
  /**
      * qualquer valor
      , separador de lista de valores
      - faixa de valores
      / valores de passo
   */
  public static get schedule() {
    return '*/10 * * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    // Logger.info('Handled')
    dayjs.extend(isLeapYear)
    dayjs.locale('pt-br')

    Logger.info('5s')

    try {
      const bets = await Bet.all()
      const currentDate = dayjs().format()

      await Promise.all(
        bets.map(async (item) => {
          const { createdAt } = item
          const dateMoreOneWeek = dayjs(String(createdAt)).add(7, 'd').format()

          // Logger.info(`created at >>>> ${dateMoreOneWeek}`)

          if (dateMoreOneWeek < currentDate) {
            Logger.info('email enviado')
          }
        })
      )
    } catch (error) {
      Logger.info('erro')
    }
  }
}
