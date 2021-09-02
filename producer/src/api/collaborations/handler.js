const ErrorHandler = require('../../utils/errorHandler');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, cacheService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._cacheService = cacheService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);
      await this._cacheService.delete(`playlists:${userId}`);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }
}

module.exports = CollaborationsHandler;
