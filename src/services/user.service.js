const sessionDAL = require("../dal/session.dal");
const usersDAL = require("../dal/user.dal");

module.exports = (function(){
    const isSessionActive = async (sessionId, userId) => {
        // returns boolean

        if (
            typeof sessionId === "undefined" ||
            !sessionId ||
            typeof userId === "undefined" ||
            !userId
        ) {
            return Promise.resolve(false);
        }
        
        // let two two async funcs run at the same time

        const promise1 = await sessionDAL.isSessionValid(sessionId);

        const promise2 = await usersDAL.getIsUserExists(userId);

        const isSessionValid = await promise1;

        const isUserExist = await promise2;

        if (isSessionValid === true && isUserExist === true) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);    
    };


    const isSessionActiveAndManager = async (sessionId, userId) => {
        // returns boolean

        if (
            typeof sessionId === "undefined" ||
            !sessionId ||
            typeof userId === "undefined" ||
            !userId
        ) {
            return Promise.resolve(false);
        }
        
        // let two two async funcs run at the same time

        const promise1 = await sessionDAL.isSessionValid(sessionId);

        const promise2 = await usersDAL.getIsUserManager(userId);

        const isSessionValid = await promise1;

        const isUserManager = await promise2;

        if (isSessionValid === true && isUserManager === true) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    };

    const getUsers = async ({ currentSessionId, currentUserId, fields, filterBy, sortBy, skipRows, pageSize }) => {
        if (!await isSessionActiveAndManager(currentSessionId, currentUserId)) {
            return Promise.reject();
        }
        
        return usersDAL.getUsers({ fields, filterBy, sortBy, skipRows, pageSize});
    };

    const createUser = async ({ currentSessionId, currentUserId, firstName, lastName, isManager }) => {
        if (!await isSessionActiveAndManager(currentSessionId, currentUserId)) {
            return Promise.reject();
        }

        return usersDAL.createUser(firstName, lastName, isManager);
    };

    const getUserByUserId = async (currentSessionId, currentUserId, userId) => {
        if (currentUserId === userId) {
            // if the logged in user wants to get their own data

            if (!await isSessionActive(currentSessionId, currentUserId)) {
                return Promise.reject();
            }
        } else {
            // only a manager can get information about other users

            if (!await isSessionActiveAndManager(currentSessionId, currentUserId)) {
                return Promise.reject();
            }
        }

        return usersDAL.getUserByUserId(userId);
    };

    return {
        getUsers,
        createUser,
        getUserByUserId
    }
})();