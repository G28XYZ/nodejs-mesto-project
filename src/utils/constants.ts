export const DEFAULT_PORT = 3000;
export const DEFAULT_BASE_PATH = 'http://localhost';
export const DEFAULT_MONGO_DB_PATH = 'mongodb://127.0.0.1:27017';
export const DEFAULT_MONGO_DB_NAME = 'mestodb';

export const ERROR_MESSAGES = {
  USER: {
    VALIDATION: {
      NAME: 'Имя должно быть не меньше 2 символов и не более 30 символов.',
      ABOUT:
        'Описание должно быть не меньше 2 символов и не более 30 символов.',
      AVATAR: 'Некорректный адрес ссылки аватарки.',
    },
    GET: {
      404: 'Пользователь по указанному _id не найден.',
      400: 'Передан некорректный _id',
    },
    CREATE: {
      400: 'Переданы некорректные данные при создании пользователя.',
    },
    PROFILE: {
      400: 'Переданы некорректные данные при обновлении профиля.',
      404: 'Пользователь с указанным _id не найден.',
    },
    AVATAR: {
      400: ' Переданы некорректные данные при обновлении аватара.',
      404: 'Пользователь с указанным _id не найден.',
    },
  },
  CARD: {
    VALIDATION: {
      NAME: 'Название должно быть не меньше 2 символов и не более 30 символов.',
      LINK: 'Некорректный адрес ссылки картинки для карточки.',
    },
    CREATE: {
      400: 'Переданы некорректные данные при создании карточки.',
    },
    DELETE: {
      403: 'Попытка удалить чужую карточку.',
      404: 'Карточка с указанным _id не найдена.',
    },
    LIKE: {
      400: 'Переданы некорректные данные для постановки/снятии лайка.',
      404: 'Передан несуществующий _id карточки.',
    },
  },
};
