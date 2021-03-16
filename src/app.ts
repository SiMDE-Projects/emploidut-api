import "reflect-metadata";
import { createConnection } from "typeorm";
import { Server } from './model/Server';

<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292
// Start the app
const server = new Server();
server.start().then( () => {
  console.log(`The server has started`);
});

// Catch Ctrl+C and properly stop the app
process.on('SIGINT', () => {
  console.log('SIGINT (Ctrl+C) received. Stopping emploidutemps.')
  server.stop().then( () => {
    process.exit()
  })
})
=======
// Cretate the connection to the database
createConnection(
{
  type: "mysql",
  host: process.env.DB_HOSTNAME,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    process.env.DB_ENTITIES_DIR || ''
  ],
  migrations: [
    process.env.DB_MIGRATIONS_DIR || ''
  ],
  subscribers: [
    process.env.DB_SUSCRIBERS_DIR || ''
  ],
  cli: {
    entitiesDir: process.env.DB_CLI_ENTITIES_DIR || '',
    migrationsDir: process.env.DB_CLI_MIGRATIONS_DIR || '',
    subscribersDir: process.env.DB_CLI_SUSCRIBERS_DIR || '' 
  }
}
).then(async connection => {
    console.log("Connected to the database");

    // Start the app
    const server = new Server();
    server.start().then( () => {
      console.log(`The server has started`);
    });

    // Catch Ctrl+C and properly stop the app
    process.on('SIGINT', () => {
      console.log('SIGINT (Ctrl+C) received. Stopping emploidut.')
      server.stop().then( () => {
        process.exit()
      })
})

}).catch(error => console.log(error));
>>>>>>> Update file in order to use typeORM
