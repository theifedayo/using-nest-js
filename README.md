## Installation

1. Clone the repository:

   `git clone https://github.com/theifedayo/using-nest-js.git`

2. Open a terminal in the repository API folder:

   `cd using nest-js`

3. Install dependencies:

   `npm install`

## Project configuration

1. Copy the `.env.example` file to `.env` in the same root folder:

   `cp .env.example .env`

2. As it is, it should work, but you can change these parameters:

   - `ACCESS_TOKEN_EXPIRATION`: expiration time of the JWT access token
   - `REFRESH_TOKEN_EXPIRATION`: expiration time of the JWT refresh token
   - `JWT_SECRET`: secret key used by JWT to encode access token
   - `JWT_REFRESH_SECRET`: secret key used by JWT to encode refresh token
   - `DATABASE_PORT`: port used by the API

## Database configuration

1. In the root of the API project, edit the file `.env` and configure these parameters using your Postgres configuration.

   ```
   POSTGRES_NAME=ifedayo
   POSTGRES_PORT=5432
   POSTGRES_PASSWORD=ifedayoPass
   POSTGRES_USER=ifedayoUser
   POSTGRES_HOST=localhost
   ```

2. Connect to your local database or start the database with docker

```
$ npm run infra:up
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

```

### Migrations.

To create a migration and implement changes in the db.

//**run old migrations, this project by default has a user migration**

```
$ npm run migration:run
```

//generate a migration

```
$ npm run migration:generate name_new_migration
```

//run the migration

```
$ npm run migration:run
```


## Endpoint security

This template uses jwt tokens and refresh tokens.

To make a route public for everyone you have to add the @Public decorator above the endpoint. Example, users.controller.ts / endpoint post, /users.

We can put three types of validations on the endpoints.

- That it has a valid token, access-token.
- That it has a valid token and is role x, example delete user can only be done by the admin role, Roles decorator.
- That the refresh token is valid.

## How refresh tokens work

The access token has to have a short lifetime, while the refresh token has to have a longer lifetime. (you can modify the duration by modifying the project variables).

When logging in, it returns the two tokens.
The refresh token is encrypted in the database, and is reset every time the user logs in or out.

When an access token expires, the endpoint will return a custom error.
httpStatus = 498
message = Token expired

In this case, a request must be made to auth/refresh-token that contains the refresh token in the header. This will return a valid access token.
