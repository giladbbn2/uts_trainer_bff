const crypto = require('crypto');

const NOT_ALLOWED_CHARS = ['"', '\'', '<', '>', '\0', '\b', '\\', '\x1a'];
const SALT = "2a2a29b03feeb53932b9b4e083d474c564!@#!()29b03feeb53932b9b4e083d474c564AASDBY";

const sanitize = (str) => {
    if (typeof str === "undefined") {
        return "";
    }

    const newStringArr = [];

    for (let i = 0; i < str.length; i++) {
        if (!NOT_ALLOWED_CHARS.includes(str[i])) {
            newStringArr.push(str[i]);
        }
    }

    return newStringArr.join("");
};

const createNewGuid = () => {
    const uts = new Date().getTime();
    return crypto.createHash("md5").update(uts + "|" + SALT).digest("hex").toLowerCase();
};

module.exports = {
    sanitize,
    createNewGuid
};