const dummyData = require('../../config/testData');
const dummyInsertUsers = require('../../config/testUsersSigIn');
const dummyRol = require('../../config/roleTest');
const dummyBook = require('../../config/testBook');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../server');
const dbConnection = require('../test-db-config');
const User = require('../../models/user.model');
const Role = require('../../models/role.model');
const Book = require('../../models/book.model')

beforeAll(async () => {
  await dbConnection.connect();

  await Promise.all([
    User.create(dummyData.testLogin),
    User.create(dummyData.wrongTestLoginPass),
    User.create(dummyData.wrongUser),
    User.create(dummyInsertUsers.newUserAdmin),
    Role.create(dummyRol.rolAdmin),
    Role.create(dummyRol.rolUser),
  ]);
});

afterAll(async () => {
    await dbConnection.clearDatabase()
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
        it('Ruta funcionando', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyInsertUsers.newUser);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        }, 20000);

        it('Insercion exitosa de nuevo usuario', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyInsertUsers.newUserInsert);
            expect(response.body.userName).toBeDefined();
            expect(response.body.userName).toBe(dummyInsertUsers.newUserInsert.userName);
        }, 20000);

        it ('Rol incorrecto', async () => {
            const response = await request(app).post('/api/auth/signup').send(dummyInsertUsers.newUserBadRole);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toContain('Failed!')
        });


    });

    describe('POST /api/auth/signin', () => {
        it('Ruta funcionando', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyInsertUsers.newUserInsert);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        }, 20000);

        it('Login exitoso', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyInsertUsers.newUserInsert);
            expect(response.body.id).toBeDefined();
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.userName).toBe(dummyInsertUsers.newUserInsert.userName);
        }, 20000);

        it('Login incorrecto por password', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyData.wrongTestLoginPass);
            expect(response.body.accessToken).toBeNull();
        }, 20000);

        it('Login incorrecto por usuario', async () => {
            const response = await request(app).post('/api/auth/signin').send(dummyData.wrongTestLoginUser);
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe('User Not found.')
        })
    });
});

describe('Pruebas sobre API de libros de los usuarios', () => {

    describe('POST /api/userBook/addBook/:id', () => {
        it('Verifica la inserción correcta de un libro para un usuario', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).post(`/api/userBook/addBook/${user.id}`).set('Authorization', `Bearer ${token}`).send(dummyBook.testBook);
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });
        it('Verifica error 404', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).post(`/api/userBook/addBoo/${user.id}`).set
        ('Authorization', `Bearer ${token}`).send(dummyBook.testBook);
            expect(response.status).toBe(404);
        });
        it('Verifica error por token erroneo', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = '';
            const response = await request(app).post(`/api/userBook/addBook/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send(dummyBook.testBook);
            expect(response.status).toBe(401);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBeDefined();
        })
        it('Verifica error por falta de token', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const response = await request(app).post(`/api/userBook/addBook/${user.id}`).set
            ('Authorization','').send(dummyBook.testBook);

            expect(response.status).toBe(403);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBeDefined();
        })
    });
    describe('GET /api/userBook/getAllBooks/:id', () => {
        it('Verifica que trae el arreglo con los ID`s de los libros de un usuario', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getAllBooks/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
        it('Verifica error 404', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getAllBook/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send();
            expect(response.status).toBe(404);
        });
        it('Verifica estado 400', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUserInsert.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getAllBooks/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send();
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
        });
    });
    describe('GET /api/userBook/getBookById/:id', () => {
        it('Obtiene la descripción de un libro', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const book = await Book.findOne({bookName: dummyBook.testBook.bookName});
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getBookById/${book._id}`).set
            ('Authorization', `Bearer ${token}`).send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });
        it('Valida error 404', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const book = await Book.findOne({bookName: dummyBook.testBook.bookName});
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getBookByI/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send({_id: book._id.toString()});
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
        });
        it('Valida error 400', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const book = await Book.findOne({bookName: dummyBook.testBook.bookName});
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/userBook/getBookById/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send({});
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
        });
    });

    describe('GET /api/userBook/deleteBook/:id', () => {
        it('Verifica la eliminación de un libro de un usuario', async() => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const book = await Book.findOne({bookISBN: dummyBook.testBook.bookISBN});
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).delete(`/api/userBook/deleteBook/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send({bookISBN: book.bookISBN});
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });

        it('Verifica error 404', async () => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const book = await Book.findOne({bookISBN: '123'});
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).delete(`/api/userBook/deleteBook/${user.id}`).set
            ('Authorization', `Bearer ${token}`).send({bookISBN: '123'});
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBeDefined();
        })

        it('Verifica error usuario no encontrado', async() => {
            const book = await Book.findOne({bookISBN: dummyBook.testBook.bookISBN});
            const response = await request(app).delete(`/api/userBook/deleteBook/123`).set
            ('Authorization', `Bearer askduyiuwqyqo`).send({bookISBN: dummyBook.testBook.bookISBN});
            expect(response.status).toBe(401);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBeDefined();
        });
    });
})

describe ('Pruebas sobre user.controller', () => {
    describe('GET /api/test/all', () => {
        it('Acceso contenido publico', async () => {
            const response = await request(app).get(`/api/test/all`).send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        })
    });
    describe ('GET /api/test/user', () => {
        it('Acceso contenido usuario', async () => {
            const user = await User.findOne({ userName: dummyInsertUsers.newUser.userName });
            const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: '2h'});
            const response = await request(app).get(`/api/test/user`).set
            ('Authorization', `Bearer ${token}`).send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });
    })
})

describe('Pruebas sobre Server.js', () => {
    it('Prueba de ruta raiz', async () => {
        const response = await request(app).get(`/`).send();
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    })
})

describe('Pruebas sobre funcion initial', () => {
    beforeEach(async () => {
        await Role.deleteMany({});
    });
    it('Prueba de insercion de roles correcta', async () => {
        await app.initial();

        const roles = await Role.find({});
        expect(roles).toHaveLength(2);

        const userRole = roles.find(role => role.name === 'user');
        expect(userRole).toBeDefined();

        const adminRole = roles.find(role => role.name === 'admin');
        expect(adminRole).toBeDefined();
    })
})
