import 'express-async-errors';
import { join } from 'path';
import { createServer } from 'http';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import connectDB from './startup.js';
import taxRoutes from './routes/taxrate.route.js';
import productRoutes from './routes/product.route.js';
import customerRoutes from './routes/customer.route.js';
import orderRoutes from './routes/order.route.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import infoRoutes from './routes/info.route.js';
import companyRoutes from './routes/company.route.js';
import errorHandler from './middlewares/error-handler.js';
import { logger } from './helpers/logger.js';
import path from 'path';

const __dirname = path.resolve();
const app = express();

process.on("uncaughtException", (error) => {
    logger.log(error.message, error);
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
    console.log("Listening on " + bind);
  };
  
  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);
  

// Express Config Settings
app.use(json());
app.use(urlencoded({extended: true}));
app.use(helmet());
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization, User, x-auth-token');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', express.static(join(__dirname, "hisaab")));

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
  res.sendFile(join(__dirname, 'hisaab', 'index.html'));
});

app.use(errorHandler);

const server = createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);