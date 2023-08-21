import bunyan from 'bunyan';
import dotenv from 'dotenv';

dotenv.config();

class Config {
  public MONGODB_URI: string | undefined;
  public PORT: string | undefined;
  public NODE_EN: string | undefined;
  public JWT_TOKEN: string | undefined;

  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.MONGODB_URI = process.env.MONGODB_URI;
    this.PORT = process.env.PORT;
    this.NODE_EN = process.env.NODE_ENV;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.REDIS_HOST = process.env.REDIS_HOST;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public checkEnvVariables(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Environment variable ${key} is missing`);
      }
    }
  }
}

export const config: Config = new Config();
