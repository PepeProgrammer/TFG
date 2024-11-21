import { CreationOptional, InferAttributes, InferCreationAttributes, Model, DataTypes } from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy'

export class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING)
  @NotNull
  declare url: string

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare animal_id: number
}
