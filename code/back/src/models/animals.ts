import { CreationOptional, InferAttributes, InferCreationAttributes, Model, DataTypes } from '@sequelize/core'
import { Attribute, Default, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy'
import { AnimalSpecies } from '../enums'

export class Animal extends Model<InferAttributes<Animal>, InferCreationAttributes<Animal>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare association_id: number

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING)
  @NotNull
  @Default('mixed')
  declare breed: string

  @Attribute(DataTypes.ENUM(AnimalSpecies.DOG, AnimalSpecies.CAT))
  @NotNull
  declare species: AnimalSpecies

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare description: string

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare age: string
}
