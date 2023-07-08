const parseCookies = (request) => {
    const list = {};

    if (typeof request.headers === "undefined") {
        return list;
    }

    const cookieHeader = request.headers.cookie;
    
    if (!cookieHeader) 
        return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        
        if (typeof name !== "undefined") {
            name = name.trim();
        }
        
        if (!name) 
            return;

        const value = rest.join(`=`).trim();
        
        if (!value) 
            return;
        
        list[name] = decodeURIComponent(value);
    });

    return list;
};

const getRequestSessionIdAndUserId = (request) => {
    const cookies = parseCookies(req);
    
    let currentSessionId = null;
    let currentUserId = null;

    if (typeof cookies["session_id"] !== "undefined" && typeof cookies["user_id"] !== "undefined") {
        currentSessionId = cookies["session_id"];
        currentUserId = cookies["user_id"];
    }

    return {
        currentSessionId,
        currentUserId
    };
};

module.exports = {
    parseCookies,
    getRequestSessionIdAndUserId
};