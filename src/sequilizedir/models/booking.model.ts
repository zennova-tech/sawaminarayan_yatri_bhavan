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
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Users from './users.model';

export interface IBooking {
  id?: string;
  check_in: Date;
  check_out: Date;
  rooms_booked: number;
  guests_per_room: number;
  extra_mattresses: number;
  total_amount: number;
  payment_id: string;
  user_id: string;
  payment_type: string;
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
  id: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  check_in: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  check_out: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  rooms_booked: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  guests_per_room: number;

  @AllowNull(true)
  @Default(0)
  @Column(DataType.INTEGER)
  extra_mattresses: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  total_amount: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  payment_id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  payment_type: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  total_guests: number;

  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  user_id: string;

  @AllowNull(false)
  @Default('SYSTEM')
  @Column(DataType.STRING)
  created_by: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deleted_at: Date;

  @BelongsTo(() => Users, { as: 'users' })
  user: Users;
}

export default Booking;
