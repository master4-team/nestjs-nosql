import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { initDb } from '../src/scripts/initDb';
import { UserService } from '../src/modules/models/user/user.service';
import { RefreshTokenService } from '../src/modules/models/refreshToken/refreshToken.service';
import { CrudService } from '../src/modules/models/crud/crud.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let server: any;
  let refreshToken: string;
  let adminAccessToken: string;
  let userId: string;
  let crudId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    server = app.getHttpServer();
    const userService = app.get<UserService>(UserService);
    const refreshTokenService =
      app.get<RefreshTokenService>(RefreshTokenService);
    const crudService = app.get<CrudService>(CrudService);
    await userService.deleteAll();
    await refreshTokenService.deleteAll();
    await crudService.deleteAll();

    await initDb(app);

    await app.listen(4009);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health/ping (GET)', () => {
    return request(server)
      .get('/api/health/ping')
      .expect(200)
      .expect((res) => expect(res.body?.data).toBe('OK'));
  });

  it('/api/health (GET)', () => {
    return request(server)
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.status).toBe('ok');
      });
  });

  it('/api/auth/register (POST)', () => {
    return request(server)
      .post('/api/auth/register')
      .send({
        username: 'zuj',
        password: '1234',
        email: 'zuj@gmail.com',
        name: 'ZUJ',
      })
      .expect(201)
      .expect((res) => expect(res.body?.data?.username).toBeDefined());
  });

  it('/api/auth/login (POST)', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'zuj', password: '1234' })
      .expect(201)
      .expect((res) => {
        accessToken = res.body?.data?.accessToken;
        refreshToken = res.body?.data?.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
      });
  });

  it('/api/refresh-token/refresh (POST)', () => {
    return request(server)
      .post('/api/refresh-token/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(201)
      .expect((res) => {
        accessToken = res.body?.data?.accessToken;
        expect(accessToken).toBeDefined();
      });
  });

  it('/api/user/me (GET)', () => {
    return request(server)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        userId = res.body?.data?.id;
        expect(userId).toBeDefined();
      });
  });

  it('/api/user/me (PUT)', () => {
    return request(server)
      .put('/api/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'ZUJ2023', email: 'zuj@gmail.com', phone: '+84 123456789' })
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.name).toBe('ZUJ2023');
      });
  });

  it('/api/user/me/change-password (PUT)', () => {
    return request(server)
      .put('/api/user/me/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ oldPassword: '1234', newPassword: '12345' })
      .expect(200)
      .expect((res) => {
        expect(res.body?.data).toHaveProperty('id');
      });
  });

  it('/api/auth/login (POST)', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'root', password: 'root' })
      .expect(201)
      .expect((res) => {
        adminAccessToken = res.body?.data?.accessToken;
        expect(accessToken).toBeDefined();
      });
  });

  it('/api/crud (POST)', () => {
    return request(server)
      .post('/api/crud')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayName: 'displayName' })
      .expect(201)
      .expect((res) => {
        expect(res.body?.data?.displayName).toBe('displayName');
        crudId = res.body?.data?._id;
      });
  });

  it('/api/crud/all (GET)', () => {
    return request(server)
      .get('/api/crud/all')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.length).toBe(1);
      });
  });

  it('/api/crud (GET)', () => {
    return request(server)
      .get('/api/crud')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.length).toBe(1);
      });
  });

  it('/api/crud/:id (GET)', () => {
    return request(server)
      .get(`/api/crud/${crudId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.displayName).toBe('displayName');
      });
  });

  it('/api/crud/:id (PUT)', () => {
    return request(server)
      .put(`/api/crud/${crudId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayName: 'newDisplayName' })
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.displayName).toBe('newDisplayName');
      });
  });

  it('/api/crud/:id (DELETE)', () => {
    return request(server)
      .delete(`/api/crud/${crudId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.deletedCount).toBe(1);
      });
  });
});
