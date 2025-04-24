import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

export class SwaggerConfig {
  static setup(
    app: INestApplication,
    options: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    },
  ) {
    app.use(
      [`/${options.path}`, `/${options.path}-json`],
      expressBasicAuth({
        challenge: true,
        users: { [options.username]: options.password },
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle(options.title)
      .setDescription(options.description)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(options.path, app, document);
  }
}
