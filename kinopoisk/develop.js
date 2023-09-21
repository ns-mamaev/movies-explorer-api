const fs = require('fs');
const path = require('path');
const db = require('./kpDB.json');

function mapMovies(movies) {
  return movies.map(({ movie }) => ({
    movieId: movie.id,
    country: movie.countries[0].name,
    director: movie.directors.items[0].person.name,
    duration: movie.duration,
    year: movie.productionYear,
    description: movie.title.russian,
    image: `https:${movie.poster.avatarsUrl}/300x450`,
    thumbnail: `https:${movie.poster.avatarsUrl}/72x108`,
    trailerLink: movie.url,
    nameRU: movie.title.russian,
    nameEN: movie.title.original,
  }));
}

const movies = mapMovies(db.data.movieListBySlug.movies.items);

fs.writeFile(
  path.join(__dirname, 'films.json'),
  JSON.stringify(movies),
  () => console.log('done'),
);
