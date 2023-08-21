import { createAdapter } from '@socket.io/redis-adapter';
import Logger from 'bunyan';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import {
  Application,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import HTTP_STATUS from 'http-status-codes';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { config } from './config';
import applicationRoutes from './routes';
import {
  CustomError,
  IErrorResponse,
} from './shared/globals/helpers/error-handler';


const logger: Logger = config.createLogger('Server');
export class ChattySnServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.standardMiddleware(this.app);
    this.securityMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorMiddleware(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
    app.use(helmet());
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 60 * 60 * 1000,
        secure: config.NODE_EN === 'production' ? true : false,
      }),
    );
    app.use(hpp());
  }

  private standardMiddleware(app: Application): void {
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.use(compression());
    app.use(this.securityMiddleware);
  }

  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorMiddleware(app: Application): void {
    app.all('*', (req, res, next) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
      });
    });
    app.use(
      (
        err: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        logger.error(err);
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err.serializeErrors());
        }
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      const socketIO = await this.createSocketIO(httpServer);
      this.socketIOConnections(socketIO);
      this.startHttpServer(httpServer);
      this.createSocketIO(httpServer);
    } catch (error) {
      logger.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = createClient({
      url: config.REDIS_HOST,
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  }

  private socketIOConnections(io: Server): void {}
}
