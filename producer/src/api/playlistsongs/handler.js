const ErrorHandler = require('../../utils/errorHandler');

class PlaylistSongsHandler {
  constructor(playlistsService, songsService, playlistSongsService, collaborationsService, cacheService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistSongsService = playlistSongsService;
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;

      this._validator.validatePlayslistSongsPayload(request.payload);

      const { songId } = request.payload;
      await this._songsService.verifySong(songId);
      const { id: credentialId } = request.auth.credentials;
      try {
        await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      } catch (error) {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      }

      await this._playlistSongsService.addSongToPlaylist({
        songId, playlistId,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistId,
        },
      });

      response.code(201);
      await this._cacheService.delete(`songs:${credentialId}`);
      return response;
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      let songs;
      const { playlistId } = request.params;

      const { id: credentialId } = request.auth.credentials;

      try {
        await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      } catch (error) {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      }
      try {
        songs = await this._cacheService.get(`songs:${credentialId}`);
      } catch (error) {
        songs = await this._playlistSongsService.getPlaylistSongs(playlistId);
        await this._cacheService.set(`songs:${credentialId}`, JSON.stringify(songs));
      }
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;

      const { id: credentialId } = request.auth.credentials;

      try {
        await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      } catch (error) {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      }

      const { songId } = request.payload;
      await this._songsService.verifySong(songId);

      await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

      await this._cacheService.delete(`songs:${credentialId}`);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }
}

module.exports = PlaylistSongsHandler;
