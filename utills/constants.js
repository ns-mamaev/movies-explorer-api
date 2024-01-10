module.exports.URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports.DOUBLE_FILM_MESSAGE = 'Фильм с данным id уже добавлен в базу';
module.exports.FILM_NOT_FOUND_MESSAGE = 'Фильм с таким id не найден';
module.exports.INCORRECT_ID_MESSAGE = 'Передан некорректный формат id';
module.exports.SUCCESS_REMOVE_FILM_MESSAGE = 'Фильм удалён';
module.exports.REMOVE_NOT_OWN_FILM_MESSAGE = 'Нельзя удалять чужие фильмы';

module.exports.LOGOUT_MESSAGE = 'Вы вышли из профиля';
module.exports.DOUBLE_EMAIL_MESSAGE = 'Пользователь с данным email уже существует';
module.exports.AUTH_REQUIRED_MESSAGE = 'Необходима авторизация для доступа к запрашиваемому ресурсу';
module.exports.INCORRECT_CREDENTIALS_MESSAGE = 'Неправильная почта или пароль';

module.exports.INTERNAL_SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';

module.exports.RUSSIAN_MOVIES_CONDITION = [/россия/i, /СССР/i];

module.exports.GENRES = {
  драма: { id: 8, mood: 'sad' },
  комедия: { id: 6, mood: 'funny' },
  биография: { id: 22, mood: 'basic' },
  криминал: { id: 16, mood: 'tense' },
  боевик: { id: 3, mood: 'amazed' },
  триллер: { id: 4, mood: 'tense' },
  семейный: { id: 11, mood: 'funny' },
  фантастика: { id: 2, mood: 'amazed' },
  приключения: { id: 10, mood: 'amazed' },
  мультфильм: { id: 14, mood: 'funny' },
  детектив: { id: 17, mood: 'tense' },
  фэнтези: { id: 5, mood: 'amazed' },
  мелодрама: { id: 7, mood: 'sad' },
  история: { id: 23, mood: 'basic' },
  военный: { id: 19, mood: 'tense' },
  вестерн: { id: 13, mood: 'tense' },
  музыка: { id: 21, mood: 'funny' },
  мюзикл: { id: 9, mood: 'funny' },
  спорт: { id: 24, mood: 'amazed' },
};

module.exports.MIN_MOOD_SCORE = 4;

// (!) обязательно в каждой сортировке должны быть уникальные поля (название или id),
// иначе сортировка не будет детерминированной и возможны дубли при пагинации
module.exports.SORT_OPTIONS = {
  titleAsk: { nameRU: 1 },
  titleDesk: { nameRU: -1 },
  ratingAsk: { ratingKP: 1, nameRU: 1 },
  ratingDesk: { ratingKP: -1, nameRU: 1 },
  yearAsk: { year: 1, nameRU: 1 },
  yearDesk: { year: -1, nameRU: 1 },
};

module.exports.RAITING_OPTIONS = {
  top250: { top250: { $ne: null } },
  gte8: { ratingKP: { $gte: 8 } },
  gte7: { ratingKP: { $gte: 7 } },
  gte6: { ratingKP: { $gte: 6 } },
};

module.exports.YEAR_OPTIONS = {
  current: { year: new Date().getFullYear() },
  last: { year: new Date().getFullYear() - 1 },
  from2020: { $and: [{ year: { $gte: 2020 } }, { year: { $lt: new Date().getFullYear() - 1 } }] },
  from2010: { $and: [{ year: { $gte: 2010 } }, { year: { $lt: 2020 } }] },
  from2000: { $and: [{ year: { $gte: 2000 } }, { year: { $lt: 2010 } }] },
  less2000: { year: { $lt: 2000 } },
};
