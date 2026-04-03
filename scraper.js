const dewapi = require('dew-api');

async function searchMovies(query) {
  return await dewapi.movie.cinesubz(query);
}

async function getMovieDownload(url) {
  return await dewapi.movie.cinesubzdl(url);
}

module.exports = {
  searchMovies,
  getMovieDownload
};
