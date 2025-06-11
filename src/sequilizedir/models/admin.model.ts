import { Optional } from 'sequelize';
import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    Default,
    AllowNull,
    Unique,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from 'sequelize-typescript';

export interface IAdmin {
    id?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    password: string;
}

interface ICreateAdminAttribute extends Optional<IAdmin, "id"> { }

@Table({
    tableName: 'admins',
    timestamps: true,
    paranoid: true,
})
class Admin extends Model<IAdmin, ICreateAdminAttribute> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    first_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    last_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    phone_number?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at!: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deleted_at?: Date;
}

export default Admin;
