import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/healthcheck (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/healthcheck')
      .expect(200);
  });

  it('/metrics (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/metrics')
      .expect(200);
  });

  it('/docs.json (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/docs.json')
      .expect(200);
  });
});
