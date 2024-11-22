import { Sequelize } from '@sequelize/core'
import { MySqlDialect } from '@sequelize/mysql'
import { User } from './users'
import { Animal } from './animals'
import { Image } from './images'
import { State } from './States'
import { Country } from './countries'

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

sequelize.addModels([User, Animal, Image, State, Country])

Animal.hasMany(Image, {
  foreignKey: 'animal_id'
})

User.hasMany(Animal, {
  foreignKey: 'association_id'
})

Country.hasMany(State, {
  foreignKey: 'countryId'
})

export default sequelize
