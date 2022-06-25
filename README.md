# JCI

## Getting Started

0. Clone the repository
1. Install the dependencies
   1. In the root directory, run `npm install`
   2. In the _/server_ directory, run `npm install`
   3. In the _/client_ directory, run `npm install`
2. Create the _.env_ files
   1. Go to the _/server_ directory and copy and complete the _.env_ file
   2. Go to the _/client_ directory and copy and complete the _.env_ file
3. Create a _session.key_ file in the _/server_ directory by running `cd server && npx @fastify/secure-session > session.key`
4. You may need to follow the instructions at [database section](#Database) to create the database.
5. Start the project with `npm run start` (by default, the React app will be started on port 3000 and the API will be started on port 3001)

## Development

The frontend is developed using React.js and Typescript in the _/client_ directory.
The backend is developed using Node.js, Fastify and Typescript in the _/server_ directory.

## Database

0. Go to the _/server_ directory
1. With MySQL, create a database named according to the name given in the _.env_
2. Use `npx prisma db push` to apply the schema to the database
3. Use `ts-node server/src/utils/fakerDatabase.ts` to generate fake data
