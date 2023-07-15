DB: PostgreSQL

- Clone the repository
- Install packages: npm i
- Copy .env.example file and create .env file
- Run migrations using command: npm run migration:run
- To run a project: npm run start:dev

Endpoints:

- register user: POST http://localhost:${PORT}/users
- Authenticate as a user: POST http://localhost:${PORT}/auth/login
- Return list of users: GET http://localhost:${PORT}/users/
- Change user's boss PATCH http://localhost:${PORT}/users/:id/change-head
