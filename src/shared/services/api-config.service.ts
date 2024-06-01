import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isNil } from "lodash";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isLogRequest(): boolean {
    return this.getBoolean("LOG_REQUEST");
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value;
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV");
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + "/../../modules/**/*.entity{.ts,.js}"];
    // let migrations = [__dirname + "/../../database/migrations/*{.ts,.js}"];
    return {
      entities,
      synchronize: true,
      // migrations,
      // keepConnectionAlive: !this.isTest,
      // dropSchema: this.isTest,
      type: "postgres",
      host: this.getString("DB_HOST"),
      port: this.getNumber("DB_PORT"),
      username: this.getString("DB_USERNAME"),
      password: this.getString("DB_PASSWORD"),
      database: this.getString("DB_DATABASE"),
      ssl: true,
      // migrationsRun: true,
      logging: this.getBoolean("ENABLE_ORM_LOGS"),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString("AWS_S3_BUCKET_REGION"),
      bucketApiVersion: this.getString("AWS_S3_API_VERSION"),
      bucketName: this.getString("AWS_S3_BUCKET_NAME"),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean("ENABLE_DOCUMENTATION");
  }

  get natsEnabled(): boolean {
    return this.getBoolean("NATS_ENABLED");
  }

  get authConfig() {
    return {
      privateKey: this.getString("JWT_PRIVATE_KEY"),
      publicKey: this.getString("JWT_PUBLIC_KEY"),
      jwtSecret: this.getString("JWT_SECRET"),
      jwtRefreshExpirationTime: this.getString("JWT_REFRESH_EXPIRATION_TIME"),
      jwtAccessExpirationTime: this.getString("JWT_ACCESS_EXPIRATION_TIME"),
    };
  }

  get appConfig() {
    return {
      port: this.getString("PORT"),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable does not set"); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
