import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import helmet from "helmet";
import * as morgan from "morgan";
import rateLimit from "express-rate-limit";
import * as compression from "compression";

import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AppModule } from "./app.module";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { HTTPLogger } from "./common/interceptor/logger";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix("/api");
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //   }),
  // );
  app.use(compression());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new HTTPLogger(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: errors => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;

  await app.listen(port);
  console.info(`Server running on port ${port} 👍`);
}
bootstrap();
