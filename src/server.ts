import { PORT } from '@config';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import http from 'http';
import cron from 'node-cron';
import { Server } from 'socket.io';
import { releaseBookedRooms } from './controllers/booking.controller';
import passport from './middleware/passport';
import router from './routes';
import { sequelize } from './sequilizedir/models';

const app: Express = express();
const port = PORT ?? 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});
app.use(passport.initialize());
app.use('/', router);

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log('info', 'Connection has been established successfully.');
  } catch (error) {
    console.log('error', 'Unable to connect to the database:', error);
    setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
  }
};

const main = async () => {
  await connectWithRetry();

  // Run every day at 9:00 AM IST
  cron.schedule(
    '0 10 * * *',
    async () => {
      console.log('Running cron at 10:00 AM IST');
      await releaseBookedRooms();
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );
};
main();

server.listen(port, () => {
  console.log('=================================');
  console.log('======= ENV:', port, '========');
  console.log('=================================');
});
