import { Sequelize, DataTypes } from 'sequelize';
import { User } from '../model/User';
import { Course } from '../model/Course';

export const sequelize = new Sequelize(
    process.env.DB_DATABASE??'',
    process.env.DB_USER??'',
    process.env.DB_PASSWORD??'',
    {
        dialect: 'mariadb',
        dialectOptions: {
        // Your mariadb options here
        connectTimeout: 1000
        }
    }
);

Course.init({
    name: DataTypes.STRING,
}, {
    freezeTableName: true,
    timestamps: false,
    sequelize,
    modelName: 'courses',
});

User.init({
    login: DataTypes.STRING,
    courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: Course,
          key: 'id'
        }
      },
}, {
    freezeTableName: true,
    timestamps: false,
    sequelize,
    modelName: 'users',
});
