const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dummyData = require('../../config/testData');
const request = require('supertest');
const app = require('../../../server');
const dbConfig = require('../../config/db.config');
const User = require('../../models/user.model');

describe('Pruebas sobre API de autorización y registro', () => {
    let connection;
    let db;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();

        connection = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = connection.db();
    });

    afterAll(async () => {
        await connection.close();
        await mongoServer.stop();
    });

    describe('POST /api/auth/signup', () => {
        it('Ruta funcionando', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyData.newUser);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        }, 20000);

        it('Insercion exitosa de nuevo usuario', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyData.newUserInsert);
            expect(response.body._id).toBeDefined();
            expect(response.body.userName).toBe(dummyData.newUserInsert.userName);
        }, 20000);
    });

    describe('POST /api/auth/signin', () => {
        it('Ruta funcionando', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyData.testLogin);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        }, 20000);

        it('Login exitoso', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyData.testLogin);
            expect(response.body.id).toBeTruthy();
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.userName).toBe(dummyData.testLogin.userName);
        }, 20000);

        it('Login incorrecto por password', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyData.wrongTestLoginPass);
            expect(response.body.accessToken).toBeUndefined();
        }, 20000);
    });
});
