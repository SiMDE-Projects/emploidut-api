import { Server } from './model/Server';

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