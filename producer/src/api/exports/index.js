const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: '_exports',
  version: '1.0.0',
  register: async (server, {
    producerService, playlistsService, collaborationsService, validator,
  }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsService, collaborationsService, validator);
    server.route(routes(exportsHandler));
  },
};
