const usersService = require("../services/user.service");
const controllerUtils = require("../utils/controller");

const express = require('express');
const router = express.Router();

router.get('/get_users', async (req, res) => {
    const { currentSessionId, currentUserId } = usersService.getRequestSessionIdAndUserId(request);

    if (!currentSessionId || !currentUserId) {
        res.status(401).send("Unauthorized request");
        return;   
    }

    let queryB64 = null;
    let query = null;

    if (typeof req.query.query !== "undefined") {
        queryB64 = req.query.query;

        try {
            const buff = new Buffer(queryB64, 'base64');
            query = JSON.parse(buff.toString('utf8'));
        } catch (error) {
            console.error(error);
        }
    }

    if (query === null) {
        res.status(500).send("query parameter not sent");
    } else {
        const { fields, filterBy, sortBy, skipRows, pageSize } = query;

        const users = await usersService.getUsers(currentSessionId, currentUserId, fields, filterBy, sortBy, skipRows, pageSize);

        res.status(200).json(users);
    }
});

router.get('/get_user/:user_id', async (req, res) => {
    if (typeof req.params.user_id === "undefined" || req.params.user_id === null || req.params.user_id === "") {
        // missing user_id parameter
        res.status(500).send("Error");
        return;
    }

    const { currentSessionId, currentUserId } = usersService.getRequestSessionIdAndUserId(request);

    if (!currentSessionId || !currentUserId) {
        res.status(401).send("Unauthorized request");
        return;   
    }

    try {
        const user = await usersService.getUserByUserId(currentSessionId, currentUserId, req.params.user_id);

        res.status(200).json(user);
    } catch (error) {
        console.error(error);

        res.status(500).send(error);
    }
});

module.exports = router