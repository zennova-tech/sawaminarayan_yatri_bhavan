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

export interface IHotelSettings {
    id?: string;
    total_rooms: number;
    available_rooms: number;
    booked_rooms: number;
    under_maintenance_rooms: number;
    room_amount: number;
    room_capacity: number;
    mattress_amount: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface ICreateHotelSettingsAttributes extends Optional<IHotelSettings, 'id'> { }

@Table({
    tableName: 'hotel_settings',
    timestamps: true,
    paranoid: true,
})
class HotelSettings extends Model<IHotelSettings, ICreateHotelSettingsAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    total_rooms!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    available_rooms?: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    booked_rooms?: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    under_maintenance_rooms?: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    room_amount!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    room_capacity!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(6, 2))
    mattress_amount!: number;

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

export default HotelSettings;
