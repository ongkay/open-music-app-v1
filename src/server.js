const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
require('dotenv').config(); //- mengimpor dotenv dan menjalankan konfigurasinya

//Server Runing
const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: 5000,
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator, //tambahkan disini validator
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
