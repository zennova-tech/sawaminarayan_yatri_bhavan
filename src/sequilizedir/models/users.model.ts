import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import Booking from './booking.model';

export interface IUsers {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password: string;
  role: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pin_code: string;
}

interface ICreateAdminAttribute extends Optional<IUsers, 'id'> {}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
class Users extends Model<IUsers, ICreateAdminAttribute> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  first_name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  last_name: string;

  @Column(DataType.STRING)
  role: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  phone_number: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address_line_1: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address_line_2: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  city: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  state: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  pin_code: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  password: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deleted_at: Date;
}

export default Users;
