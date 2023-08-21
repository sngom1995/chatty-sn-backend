import express, { Express } from 'express';
import { config } from './config';
import databaseConnection from './setupDatabase';
import { ChattySnServer } from './setupServer';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const chatServer: ChattySnServer = new ChattySnServer(app);
    chatServer.start();
  }

  private loadConfig(): void {
    config.checkEnvVariables();
  }
}

const application: Application = new Application();
application.initialize();
