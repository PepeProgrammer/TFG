import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { Attribute, AutoIncrement, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy'

export class Country extends Model<InferAttributes<Country>, InferCreationAttributes<Country>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string
}
