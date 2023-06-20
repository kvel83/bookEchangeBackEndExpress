const dummyData = require('../../config/testData');
const dummyInsertUsers = require('../../config/testUsersSigIn');
const dummyRol = require('../../config/roleTest');
const request = require('supertest');
const app = require('../../../server');
const dbConnection = require('../test-db-config');
const User = require('../../models/user.model');
const Role = require('../../models/role.model');

beforeAll(async () => {
  await dbConnection.connect();

  await Promise.all([
    User.create(dummyData.testLogin),
    User.create(dummyData.wrongTestLoginPass),
    User.create(dummyData.wrongTestLoginUser),
    User.create(dummyData.wrongUser),
    Role.create(dummyRol.rolAdmin),
    Role.create(dummyRol.rolUser),
  ]);
});

afterAll(async () => {
  await dbConnection.closeDatabase();
});

describe('Pruebas sobre API de autorización y registro', () => {

    it('Verificar inserción de nuevos usuarios', async () => {
        const user1 = await User.findOne({ userName: dummyData.testLogin.userName });
        const user2 = await User.findOne({ userName: dummyData.wrongTestLoginPass.userName });

        expect(user1).toBeDefined();
        expect(user1.userName).toBe(dummyData.testLogin.userName);

        expect(user2).toBeDefined();
        expect(user2.userName).toBe(dummyData.wrongTestLoginPass.userName);
    });
    it('Verificar inserción de nuevos roles', async () => {
        const rol1 = await Role.findOne({ name: dummyRol.rolAdmin.name });
        const rol2 = await Role.findOne({ name: dummyRol.rolUser.name });
        expect(rol1).toBeDefined();
        expect(rol1.name).toBe(dummyRol.rolAdmin.name);
        expect(rol2).toBeDefined();
        expect(rol2.name).toBe(dummyRol.rolUser.name);
    });
    describe('POST /api/auth/signup', () => {
        // it('Ruta funcionando', async () => {
            // const response = await request(app).post('/api/auth/signup').send(dummyInsertUsers.newUser);
            // console.log(response.status);
            // console.log(response.body);
            // console.log(response.headers);
            // expect(response.status).toBe(200);
            // expect(response.headers['content-type']).toContain('json');
        // }, 20000);

        it('Insercion exitosa de nuevo usuario', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyInsertUsers.newUserInsert);
            console.log(response);
            expect(response.body.userName).toBeDefined();
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
            expect(response.body.id).toBeDefined();
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.userName).toBe(dummyData.testLogin.userName);
        }, 20000);

        it('Login incorrecto por password', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyData.wrongTestLoginPass);
            expect(response.body.accessToken).toBeNull();
        }, 20000);
    });
});
