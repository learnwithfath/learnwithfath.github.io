import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Controller('v1')
class HealthController {
    @Get('health')
    health() {
        return { status: 'ok' };
    }
}

@Module({ controllers: [HealthController] })
class AppModule {}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 8081);
}

void bootstrap();
