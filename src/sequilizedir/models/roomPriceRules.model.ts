import { Optional } from "sequelize";
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
} from "sequelize-typescript";

export interface IRoomPriceRules {
  id: string;
  name: string;
  start_date: string | Date;
  end_date: string | Date;
  price_per_night: number;
  is_default_price: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

interface ICreateRoomPriceRulesAttribute
  extends Optional<IRoomPriceRules, "id"> {}

@Table({
  tableName: "room_price_rules",
  timestamps: true,
  paranoid: true,
})
class RoomPriceRules extends Model<
  IRoomPriceRules,
  ICreateRoomPriceRulesAttribute
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  start_date: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  end_date: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  price_per_night: number;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  is_default_price: boolean;

  @CreatedAt
  @Column({ field: "created_at" })
  created_at: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updated_at: Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  deleted_at: Date;
}

export default RoomPriceRules;
