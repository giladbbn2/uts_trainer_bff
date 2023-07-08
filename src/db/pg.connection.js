const getConfig = require("../config");
const { Pool } = require("pg");

module.exports = (function(){
    let connection = null;

    const config = getConfig();

    const connect = async () => {
        if (connection === null) {
            connection = new Pool({
                host: config.db_pg_host,
                user: config.db_pg_user,
                password: config.db_pg_password,
                database: config.db_pg_db,
                port: config.db_pg_port
            });
        }

        return Promise.resolve();
    };

    const query = async (sql, sqlParamsArr) => {
        if (typeof sql === "undefined") {
            return Promise.reject();
        }

        await connect();

        const { rows, rowCount } = await connection.query(sql, sqlParamsArr);

        return Promise.resolve({ rows, rowCount });
    };

    const closeConnection = () => {
        try {
            pool.end();
        } catch (error) {
            console.error(error);
        }
    };

    return {
        connect,
        query,
        closeConnection
    };
})();