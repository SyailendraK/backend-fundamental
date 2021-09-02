const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationsService, playlistsService, cacheService, validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService, playlistsService, cacheService, validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
