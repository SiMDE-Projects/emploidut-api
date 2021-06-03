import { Server } from './services/Server';


// Start the app
const server = new Server();
server.start().then( () => {
  console.log(`The server has started`);
});

// Catch Ctrl+C and properly stop the app
process.on('SIGINT', () => {
  console.log('SIGINT (Ctrl+C) received. Stopping emploidut.')
  server.stop().then( () => {
    process.exit();
  })
})
