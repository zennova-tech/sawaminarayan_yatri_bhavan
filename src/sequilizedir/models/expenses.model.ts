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
} from 'sequelize-typescript';

export interface IExpenses {
  id: string;
  date: string | Date;
  name: string;
  amount: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

interface ICreateExpenseAttribute extends Optional<IExpenses, 'id'> {}

@Table({
  tableName: 'expenses',
  timestamps: true,
  paranoid: true,
})
class Expenses extends Model<IExpenses, ICreateExpenseAttribute> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  date: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  notes: string;

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

export default Expenses;
