const getConfig = require("../config");
const db = require("../db/pg.connection");
const dateUtils = require("../utils/date");
const stringUtils = require("../utils/string");

/*
    The entire sessions table should not be in a SQL DB such as PostgreSQL or SQL Server
    it should be on Redis or Memcached
    I have put the sessions table in an SQL table for demonstration purposes
*/

module.exports = (function(){
    const getActiveSessions = async () => {
        // returns an array of active session objects
    };

    const isSessionValid = async (sessionId) => {
        // returns boolean

        try {
            const currentDBDt = dateUtils.toDBDateTime();

            const sql = "SELECT 1 as is_active FROM active_sessions WHERE session_id = $1 AND valid_until > $2";
            const sqlParamsArr = [sessionId, currentDBDt];
    
            const { rows } = await db.query(sql, sqlParamsArr);
    
            if (rows.length === 0 || typeof rows[0]["is_active"] === "undefined") {
                return Promise.resolve(false);
            }
    
            if (Number(rows[0]["is_active"]) === 1) {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve(false);
    };

    const isSessionValidWithUserId = async ({ sessionId, userId }) => {
        // returns boolean

        try {
            const currentDBDt = dateUtils.toDBDateTime();

            const sql = "SELECT 1 as is_active FROM active_sessions WHERE session_id = $1 AND user_id = $2 AND valid_until > $3";
            const sqlParamsArr = [sessionId, userId, currentDBDt];
    
            const { rows } = await db.query(sql, sqlParamsArr);
    
            if (rows.length === 0 || typeof rows[0]["is_active"] === "undefined") {
                return Promise.resolve(false);
            }
    
            if (Number(rows[0]["is_active"]) === 1) {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve(false);
    };

    const createSession = async (userId) => {
        // returns sessionId

        try {
            const sessionId = stringUtils.createNewGuid();
    
            const d = new Date();

            d.setMinutes(d.getMinutes() + getConfig().session_time_mins);

            const currentDBDt = dateUtils.toDBDateTime(d);
    
            const sql = "INSERT INTO active_sessions (session_id, user_id, valid_until) VALUES ($1, $2, $3)";
            const sqlParamsArr = [sessionId, userId, currentDBDt];

            const { rowCount } = await db.query(sql, sqlParamsArr);

            if (rowCount > 0) {
                return Promise.resolve(sessionId);
            } else {
                return Promise.reject("session could not be created");
            }
        } catch (error) {
            console.error(error);

            return Promise.reject(error);
        }
    };

    const deleteAllActiveSessions = async (userId) => {
        // returns boolean

        const sql = "DELETE FROM active_sessions WHERE user_id = $1";
        const sqlParamsArr = [userId];

        try {
            await db.query(sql, sqlParamsArr);

            return Promise.resolve(true);
        } catch (error) {
            console.error(error);

            return Promise.resolve(false);
        }
    };

    return {
        getActiveSessions,
        isSessionValid,
        isSessionValidWithUserId,
        createSession,
        deleteAllActiveSessions
    };
})();