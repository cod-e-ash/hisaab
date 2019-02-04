require('express-async-errors');
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./startup');
const taxRoutes = require('./routes/taxrate.route');
const productRoutes = require('./routes/product.route');
const customerRoutes = require('./routes/customer.route');
const orderRoutes = require('./routes/order.route');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const infoRoutes = require('./routes/info.route');
const companyRoutes = require('./routes/company.route');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./helpers/logger');

const app = express();

process.on("uncaughtException", (error) => {
    logger.error(error.message, error);
});
process.on("unhandledRejection", (error) => {
    throw error;
});

connectDB();


const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };
  
  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);
  

// Express Config Settings
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization, User, x-auth-token');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use("/", express.static(path.join(__dirname, "hisaab")));

// Routes
app.use('/api/taxrates', taxRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/info', infoRoutes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'hisaab', 'index.html'));
});

app.use(errorHandler);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);