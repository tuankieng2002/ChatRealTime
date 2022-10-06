const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
require('dotenv/config')
// const client = require("./helpers/connections_redis");

// client.set('foo', 'anonystick');
// client.get('foo', (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(result);
//     }
// });

let server;

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   console.log("Connected to MongoDB");
//   server = app.listen(config.port, () => {
//     console.log(`Listening to port ${config.port}`);
//   });
// });

mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
    console.log('connected to DB');
    server = app.listen(4000, () => {
        console.log(`Listening to port http://localhost:4000`);
    });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  exitHandler();
};



process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
