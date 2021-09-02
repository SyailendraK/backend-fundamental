const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({
    playlistId, songId,
  }) {
    const id = `playlist_songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: 'SELECT songs.id AS id, songs.title AS title, songs.performer AS performer FROM songs INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('lagu dalam playlist tidak ditemukan');
    }
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
