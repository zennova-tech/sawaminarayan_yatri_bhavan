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
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface IBooking {
  id?: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone_number: number;
  check_in: Date;
  check_out: Date;
  rooms_booked: number;
  guests_per_room: number;
  extra_mattresses?: number;
  total_amount: number;
  payment_id?: string;
  payment_type?: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

interface ICreateBookingAttributes extends Optional<IBooking, 'id'> {}

@Table({
  tableName: 'bookings',
  timestamps: true,
  paranoid: true,
})
class Booking extends Model<IBooking, ICreateBookingAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  first_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  last_name?: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  phone_number!: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  check_in!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  check_out!: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  rooms_booked!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  guests_per_room!: number;

  @AllowNull(true)
  @Default(0)
  @Column(DataType.INTEGER)
  extra_mattresses?: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  total_amount!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  payment_id?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  payment_type?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address_line_1: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address_line_2: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  city: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  state: string;

  @AllowNull(false)
  @Default('SYSTEM')
  @Column(DataType.STRING)
  created_by?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at?: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at?: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deleted_at?: Date;
}

export default Booking;
