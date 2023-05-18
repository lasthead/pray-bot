import {Column, Model, Table, DataType, HasMany} from "sequelize-typescript";

@Table({tableName: 'records_list'})
export class RecordModel extends Model<RecordModel> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @Column({ type: DataType.STRING, unique: false })
  chat_id: string

  @Column({ type: DataType.STRING, unique: false })
  user_id: string

  @Column({ type: DataType.TEXT, unique: false })
  text: string

  @Column({ type: DataType.STRING, unique: false })
  is_archive?: string

  @Column({ type: DataType.BOOLEAN, unique: false })
  is_done?: boolean
}
