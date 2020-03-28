import * as mysql from 'promise-mysql';

let connection;

export const ConnectDB = async() => {
    if (connection) {
        return connection;
    }

    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true
    });
    return connection;
}