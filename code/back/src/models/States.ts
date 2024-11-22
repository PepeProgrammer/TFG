import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { Attribute, AutoIncrement, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy'

export class State extends Model<InferAttributes<State>, InferCreationAttributes<State>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare countryId: number

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string
}
