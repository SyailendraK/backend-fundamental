exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('playlists', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  pgm.addConstraint('collaborations', 'fk_collaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlist.owner_users.id');

  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song.id');

  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user.id');
};
