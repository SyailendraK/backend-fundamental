const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistsService, songsService, playlistSongsService, collaborationsService, cacheService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(playlistsService, songsService, playlistSongsService, collaborationsService, cacheService, validator);
    server.route(routes(playlistSongsHandler));
  },
};
