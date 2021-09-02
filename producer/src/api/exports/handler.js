const ErrorHandler = require('../../utils/errorHandler');

class ExportsHandler {
  constructor(producerService, playlistsService, collaborationsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistSongsPayload(request.payload);

      const { playlistId } = request.params;

      const { id: credentialId } = request.auth.credentials;

      try {
        await this._playlistsService.verifyPlaylistAuthorization(playlistId, credentialId);
      } catch (error) {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      }

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });

      response.code(201);
      return response;
    } catch (error) {
      return ErrorHandler.errorHandler(error, h);
    }
  }
}

module.exports = ExportsHandler;
