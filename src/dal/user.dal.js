const db = require("../db/pg.connection");
const stringUtils = require("../utils/string");

module.exports = (function(){
    const userSelectableFields = ["user_id", "first_name", "last_name", "is_manager"];
    const userFilterableFields = {
        "user_id": "string",
        "first_name": "string",
        "last_name": "string",
        "is_manager": "boolean"
    };

    const getIsUserManager = async (userId) => {
        // returns nullable boolean

        if (!userId) {
            return Promise.reject();
        }

        const sql = "SELECT is_manager FROM users WHERE user_id = $1";
        const sqlParamsArr = [userId];

        const { rows } = db.query(sql, sqlParamsArr);

        if (!Array.isArray(rows)) {
            // user doesn't exist

            return Promise.resolve(null);
        }

        return Promise.resolve(Number(rows[0]["is_manager"]) === 1);
    };

    const getUserByUserId = async (userId) => {
        // returns a user object or null if none is found

        if (!userId) {
            return Promise.reject();
        }

        const sql = "SELECT first_name, last_name FROM users WHERE user_id = $1";
        const sqlParamsArr = [userId];

        const { rows } = db.query(sql, sqlParamsArr);

        if (Array.isArray(rows) && rows.length > 0) {
            const user = new User();
            user.userId = userId;
            user.firstName = rows[0].first_name;
            user.lastName = rows[0].last_name;

            return Promise.resolve(user);
        }

        return Promise.resolve(null);
    };

    const getIsUserExists = async (userId) => {
        // returns boolean

        if (!userId) {
            return Promise.reject();
        }

        const sql = "SELECT 1 as is_user_exists FROM users WHERE user_id = $1";
        const sqlParamsArr = [userId];
    
        const { rows } = await db.query(sql, sqlParamsArr);

        if (rows.length === 0 || typeof rows[0]["is_user_exists"] === "undefined") {
            return Promise.resolve(false);
        }

        if (Number(rows[0]["is_user_exists"]) === 1) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    };

    const createUser = async ({ firstName, lastName, isManager }) => {
        // return boolean

        if (!firstName || !lastName) {
            return Promise.reject();
        }

        const userId = stringUtils.createNewGuid();

        const sql = "INSERT INTO users (user_id, first_name, last_name, is_manager) VALUES ($1, $2, $3, $4)";
        const sqlParamsArr = [userId, firstName, lastName, isManager];

        try {
            const { rowCount } = await db.query(sql, sqlParamsArr);

            return Promise.resolve(rowCount > 0);
        } catch (error) {
            console.error(error);

            return Promise.resolve(false);
        }
    };

    const updateUser = async ({userId, firstName, lastName, isManager }) => {
        // TODO
    };

    const getUsers = async ({ fields, filterBy, sortBy, skipRows, pageSize }) => {
        /*
            returns an array of user objects

            example:

            const fields = ["first_name", "last_name"];

            const filterBy = {
                "user_id": "user1",
                "first_name": "firstname1"
            };

            const sortBy = {
                "first_name": 0,    // ASC
                "last_name": 1      // DESC
            };

            const skipRows = 10;

            const pageSize = 5;

            const users = await getUsers({ fields, filterBy, sortBy, skipRows, pageSize });

            // users is an array of objects

        */

        if (!Array.isArray(fields)) {
            return Promise.reject();
        }

        let sqlArr = ["SELECT "];
        const sqlParamsArr = [];

        let isOneFieldSelected = false;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            if (userSelectableFields.includes(field)) {
                if (isOneFieldSelected) {
                    sqlArr.push(`, ${field}`);
                } else {
                    sqlArr.push(field);
                }

                isOneFieldSelected = true;
            }
        }

        if (!isOneFieldSelected) {
            return Promise.reject("no selectable fields");
        }

        sqlArr.push(" WHERE 1=1");

        if (typeof filterBy !== "undefined") {
            if (Array.isArray(filterBy)) {
                for (let i = 0; i < filterBy.length; i++) {
                    const filterByItem = filterBy[i];

                    if (
                        Array.isArray(filterByItem) && 
                        typeof filterByItem[0] !== "undefined" &&
                        typeof filterByItem[1] !== "undefined" && 
                        filterByItem[0] in userFilterableFields
                    ) {
                        //const fieldType = userFilterableFields[filterByItem[0]];

                        const sqlParamId = sqlParamsArr.length + 1;

                        sqlArr.push(` AND ${filterByItem[0]} = ${sqlParamId}`);
                        
                        sqlParamsArr.push(filterByItem[1]);

                        isSqlWhere = true;
                    }
                }
            }
        }

        if (typeof sortBy !== "undefined") {
            if (Array.isArray(sortBy) && sortBy.length > 0) {
                let delim = " ";

                for (let i = 0; i < sortBy.length; i++) {
                    const sortByItem = sortBy[i];

                    if (
                        Array.isArray(sortByItem) && 
                        typeof sortByItem[0] !== "undefined" &&
                        typeof sortByItem[1] === "boolean"
                    ) {
                        if (!isSqlSorting) {
                            sqlArr.push(" ORDER BY");
                        }

                        const sortDir = sortByItem[1] ? "ASC" : "DESC";
                        
                        sqlArr.push(`${delim}${sortByItem[0]} ${sortDir}`);
                    }

                    delim = ", ";
                }
            }
        }

        if (typeof pageSize === "undefined") {
            pageSize = 10;
        } else if (pageSize > 10) {
            pageSize = 10;
        }

        if (typeof skipRows === "undefined") {
            skipRows = 0;
        } else if (skipRows < 0) {
            skipRows = 0;
        }

        sqlArr.push(` LIMIT ${pageSize} OFFSET ${skipRows}`);

        const sql = sqlArr.join();

        const { rows } = db.query(sql, sqlParamsArr);

        return Promise.resolve(rows);
    };
    
    return {
        getIsUserManager,
        getUserByUserId,
        getIsUserExists,
        createUser,
        updateUser,
        getUsers
    };
})();