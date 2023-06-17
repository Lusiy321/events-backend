import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreateAttrs{
    email: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreateAttrs>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.TEXT, unique: false, allowNull: false})
    name: string;
    
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;
    
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    password: string;
    
    @Column({ type: DataType.ENUM('user', 'admin', 'moderator'), defaultValue: 'user', unique: true, allowNull: false })
    role: string;
    
    @Column({ type: DataType.BOOLEAN, defaultValue:false, allowNull: false })
    isOnline: boolean;

    @Column({ type: DataType.ARRAY, defaultValue: [] })
    postsId: Array<string>;

    @Column({ type: DataType.STRING, defaultValue: null })
    token: string;

}