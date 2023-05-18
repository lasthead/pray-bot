import {Column, Model, Table, DataType, HasMany} from "sequelize-typescript";

@Table({tableName: 'users'})
export class UserModel extends Model<UserModel> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @Column({ type: DataType.STRING, unique: false })
  user_id: string

  @Column({ type: DataType.STRING, unique: false })
  user_name: string

  @Column({ type: DataType.STRING, unique: false })
  user_phone: string

  @Column({ type: DataType.STRING, unique: false })
  chat_id: string

  @Column({ type: DataType.STRING, unique: false })
  texts_created_cnt: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active?: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_admin?: boolean
}
