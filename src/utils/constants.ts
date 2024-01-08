import { HTTP_CODES } from './types';

export const DEFAULT_PORT = 3000;
export const DEFAULT_BASE_PATH = 'http://localhost';
export const DEFAULT_MONGO_DB_PATH = 'mongodb://localhost:27017';
export const DEFAULT_MONGO_DB_NAME = 'mestodb';
export const DEFAULT_SALT_LENGTH = 10;
export const DEFAULT_JWT_SECRET = 'JWT_SECRET';

export const DEFAULT_USER_SETTINGS = {
  NAME: 'Жак-Ив Кусто',
  ABOUT: 'Исследователь',
  AVATAR:
    'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

const {
  BAD_REQUEST_400,
  UNAUTHORIZED_401,
  FORBIDDEN_403,
  NOT_FOUND_404,
  CONFLICT_409,
} = HTTP_CODES;

export const ERROR_MESSAGES = {
  GENERAL: {
    VALIDATION: {
      EMPTY: 'Поле {#label} не должно быть пустым.',
      SYNTAX_JSON: 'Синтаксическая ошибка в теле запроса.',
    },
    LABELS: {
      AVATAR: 'Аватарка',
      USERNAME: 'Имя',
      ABOUT: 'О себе',
      LINK: 'Ссылка на картинку',
      CARD_NAME: 'Название карточки',
      PASSWORD: 'Пароль',
      EMAIL: 'Почта',
    },
  },
  USER: {
    VALIDATION: {
      NAME: 'Имя должно быть не меньше 2 символов и не более 30 символов.',
      ABOUT:
        'Описание должно быть не меньше 2 символов и не более 30 символов.',
      AVATAR: 'Некорректный адрес ссылки аватарки.',
      EMAIL: 'Некорректный формат почты.',
      EMPTY: 'Поле не должно быть пустым.',
      AUTH: 'Пользователь не авторизован.',
    },
    GET: {
      [BAD_REQUEST_400]: 'Передан некорректный _id',
      [NOT_FOUND_404]: 'Пользователь по указанному _id не найден.',
    },
    CREATE: {
      [BAD_REQUEST_400]:
        'Переданы некорректные данные при создании пользователя.',
      [CONFLICT_409]: 'Пользователь с указанной почтой уже существует.',
    },
    LOGIN: {
      [UNAUTHORIZED_401]: 'Передан неверный логин или пароль.',
    },
    PROFILE: {
      [BAD_REQUEST_400]: 'Переданы некорректные данные при обновлении профиля.',
      [NOT_FOUND_404]: 'Пользователь с указанным _id не найден.',
    },
    AVATAR: {
      [BAD_REQUEST_400]:
        ' Переданы некорректные данные при обновлении аватара.',
      [NOT_FOUND_404]: 'Пользователь с указанным _id не найден.',
    },
  },
  CARD: {
    VALIDATION: {
      NAME: 'Название должно быть не меньше 2 символов и не более 30 символов.',
      LINK: 'Некорректный адрес ссылки картинки для карточки.',
      EMPTY: 'Поле не должно быть пустым.',
    },
    CREATE: {
      [BAD_REQUEST_400]: 'Переданы некорректные данные при создании карточки.',
    },
    DELETE: {
      [BAD_REQUEST_400]: 'Переданы некорректные данные для удаления карточки.',
      [FORBIDDEN_403]: 'Попытка удалить чужую карточку.',
      [NOT_FOUND_404]: 'Карточка с указанным _id не найдена.',
    },
    LIKE: {
      [BAD_REQUEST_400]:
        'Переданы некорректные данные для постановки/снятии лайка.',
      [NOT_FOUND_404]: 'Передан несуществующий _id карточки.',
    },
  },
};
