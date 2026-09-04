import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Enable CORS for your website
  app.enableCors({
    origin: 'https://www.logiaegis.com', // Your website URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();