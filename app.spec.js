const server = require('./app');
const request = require('supertest');

describe('Server', () => {
	describe('/', () => {
		test('should return status 200 OK', () => {
			return request(server) // return async call to let jest know to wait
				.get('/')
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe('POST /auth/login', () => {
		beforeEach(async () => {
			await db('accountss').truncate(); // empty table and reset ids
		});

		test('should return 201 on success', () => {
			return request(server)
				.post('/auth/login')
				.send({ username: 'Timmy', password: 'password' })
				.then(res => {
					expect(res.status).toBe(201);
				});
		});

		test('should successfully create account', () => {
			return request(server)
				.post('/auth/register')
				.send({ username: 'Superboy', password: 'superpassword' })
				.then(res => {
					expect(res.body.message).toBe('user created successfully.');
				});
		});

		test('should add accounts to db', async () => {
			const accountsName = 'Billy';
			const exist = await db('accountss').where({ name: accountsName });
			expect(exist).toHaveLength(0);

			await request(server)
				.post('/accountss')
				.send({ name: accountsName })
				.then(res => {
					expect(res.body.message).toBe('accounts created successfully.');
				});
			const inserted = await db('accountss').where({ name: accountsName });
			expect(inserted).toHaveLength(1);
		});
	});
});
