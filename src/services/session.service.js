const sessionDAL = require("../dal/session.dal");
const usersDAL = require("../dal/user.dal");

module.exports = (function(){
    const isSessionValid = (sessionId) => {
        return sessionDAL.isSessionValid(sessionId);
    };

    const createSession = async (userId) => {
        if (typeof userId !== "undefined" || !userId) {
            return Promise.reject();
        }

        try {
            // verify user exists
            if (!await usersDAL.getIsUserExists(userId)) {
                return Promise.reject("user does not exist");
            }

            // first delete all active sessions for the user
            await sessionDAL.deleteAllActiveSessions(userId);

            const sessionId = await sessionDAL.createSession(userId);

            return Promise.resolve(sessionId);
        } catch (error) {   
            return Promise.reject();
        }
    };

    return {
        isSessionValid,
        createSession
    };
})();