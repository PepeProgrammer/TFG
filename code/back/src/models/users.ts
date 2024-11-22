import { CreationOptional, InferAttributes, InferCreationAttributes, Model, DataTypes } from '@sequelize/core'
import { Attribute, Default, PrimaryKey, AutoIncrement, NotNull, Unique } from '@sequelize/core/decorators-legacy'
import { UserTypes } from '../enums'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING)
  @NotNull
  @Unique
  declare username: string

  @Attribute(DataTypes.STRING)
  @NotNull
  declare lastName: string

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string

  @Attribute(DataTypes.DATE)
  @NotNull
  declare birthdate: string

  @Attribute(DataTypes.ENUM(UserTypes.ADMIN, UserTypes.ASSOCIATION, UserTypes.MODERATOR, UserTypes.STANDARD))
  @NotNull
  declare type: UserTypes

  @Attribute(DataTypes.STRING)
  declare profile_image: string

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  @NotNull
  declare adoptions: boolean

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  @NotNull
  declare take_ins: boolean

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  @NotNull
  declare sponsors: boolean

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare state: string
}
