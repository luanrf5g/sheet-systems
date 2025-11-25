import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🚨 ATENÇÃO: Adicionar a configuração CORS aqui
  app.enableCors({
    // Permite acesso de qualquer origem em ambiente de desenvolvimento.
    // Para produção, substitua '*' pelo domínio específico do seu frontend.
    origin: ['http://192.168.3.54:3000', 'http://192.168.3.54:3001',
      'http://192.168.3.213:3000',
      'http://192.168.3.213:3001'
    ],
    // ou: origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
