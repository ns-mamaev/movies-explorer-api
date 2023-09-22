const fs = require('fs');
const path = require('path');
const db = require('./kpDB.json');

function mapMovies(movies) {
  const genresSet = new Set();
  const movieData = movies.map(({ movie }) => {
    const genres = movie.genres.map(({ id, name }) => `${id}&${name}`);
    genres.forEach((genre) => genresSet.add(genre));
    return {
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
      genres: movie.genres.map(({ id }) => id),
      ratingKP: movie.rating?.kinopoisk.value,
      votes: movie.rating?.kinopoisk.count,
    };
  });

  const genresData = [...genresSet.keys()].map((genreString) => {
    const [id, name] = genreString.split('&');
    return { id, name };
  });

  return {
    movieData,
    genresData,
  };
}

const { movieData, genresData } = mapMovies(db.data.movieListBySlug.movies.items);

function writeFile(filename, data) {
  fs.writeFile(path.join(__dirname, filename), JSON.stringify(data), () => console.log(`${filename} done`));
}

// writeFile('films.json', movieData);
writeFile('genres.json', genresData);
