const ErrorHandler = require('../../utils/errorHandler');

class PlaylistHandler {
  constructor(playlistsService, cacheService, validator) {
    this._playlistsService = playlistsService;
    this._cacheService = cacheService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlayslistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });

      response.code(201);
      await this._cacheService.delete(`playlists:${credentialId}`);
      return response;
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      let playlists;
      const { id: credentialId } = request.auth.credentials;

      try {
        playlists = JSON.parse(await this._cacheService.get(`playlists:${credentialId}`));
      } catch (error) {
        playlists = await this._playlistsService.getPlaylists(credentialId);
        await this._cacheService.set(`playlists:${credentialId}`, JSON.stringify(playlists));
      }
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      await this._playlistsService.deletePlaylist(playlistId);
      await this._cacheService.delete(`playlists:${credentialId}`);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }
}

module.exports = PlaylistHandler;
