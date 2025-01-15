import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port || 3000);
}
bootstrap().then(() => {
  console.info(`Server Initialized on port: ${port}.`);
});
