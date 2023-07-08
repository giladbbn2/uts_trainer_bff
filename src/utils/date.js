const toDBDateTime = (date) => {
    // returns format YYYY-MM-DD HH-mm-ss, e.g. '2023-07-08 08:00:35'
    if (typeof date === "undefined") {
        date = new Date();
    }

    return date.toJSON().slice(0,19).replace("T", " ");
};

module.exports = {
    toDBDateTime
};