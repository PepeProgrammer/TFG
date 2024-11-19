import { Sequelize } from '@sequelize/core'
import { MySqlDialect } from '@sequelize/mysql'

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: 'adoptapp',
  user: 'admin',
  password: 'admin',
  host: 'localhost',
  port: 3306,
  showWarnings: true
})

export const testConection = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export default sequelize
