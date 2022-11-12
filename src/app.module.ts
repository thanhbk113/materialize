import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { I18nExceptionFilterPipe } from "./common/pipe/i18n-exception-filter.pipe";
import winstonConfig from "src/config/winston";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from "./modules/category/category.module";
import { HealthModule } from "./modules/health/health.module";
import { AppLoggerMiddleware } from "./middleware/logger";

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    WinstonModule.forRoot(winstonConfig),
    AuthModule,
    UserModule,
    CategoryModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilterPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
