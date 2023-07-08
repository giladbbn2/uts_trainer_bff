const express = require("express");

// load routes
const userRoute = require("./routes/user.route");
const sessionRoute = require("./routes/session.route");

const db = require("./db/pg.connection");

try {
    db.connect();

    const app = express();
    const port = 3000;
    
    app.get("/", (req, res) => {
      res.send('Hello World!');
    });
    
    app.use("/user", userRoute);

    app.use("/session", sessionRoute);
    
    app.listen(port, () => {
      console.log(`Ultrasound trainer listening on port ${port}`);
    });
} catch (error) {
    // cannot connect to db so shutdown
    // report this error

    console.error(error);
}