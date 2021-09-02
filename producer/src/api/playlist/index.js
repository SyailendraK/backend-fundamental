const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistsService, cacheService, validator }) => {
    const playlistHandler = new PlaylistHandler(playlistsService, cacheService, validator);
    server.route(routes(playlistHandler));
  },
};
