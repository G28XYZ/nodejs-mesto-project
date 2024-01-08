import mongoose, { Model } from 'mongoose';
import { Joi } from 'celebrate';
import bcrypt from 'bcryptjs';

import { HTTP_CODES, IUser, TModelSettings } from '../utils/types';
import {
  ERROR_MESSAGES,
  DEFAULT_USER_SETTINGS as DEFAULT,
} from '../utils/constants';
import validation from '../utils/validation';
import UnauthorizedError from '../errors/unauthorized-error';

const { USER, GENERAL } = ERROR_MESSAGES;

interface IUserMethods {
  findUserByCredentials(email: string, password: string): Promise<IUser>;
}

/**
 * модель настроек для пользователя с схемами модели данных и ее валидации
 */
// prettier-ignore
class UserModelSettings<
  T extends IUser,
  M extends IUserMethods & Model<T>,
> implements TModelSettings<T, M> {
  nameModel = 'user';

  validationSchema: Record<string, Joi.PartialSchemaMap<T>> = {
    /** схема для валидации при создании пользователя */
    create: {
      name: Joi.string()
        .label(GENERAL.LABELS.USERNAME)
        .min(2)
        .rule({ message: USER.VALIDATION.NAME })
        .max(30)
        .rule({ message: USER.VALIDATION.NAME }),
      about: Joi.string()
        .label(GENERAL.LABELS.ABOUT)
        .min(2)
        .rule({ message: USER.VALIDATION.ABOUT })
        .max(30)
        .rule({ message: USER.VALIDATION.ABOUT }),
      avatar: Joi.string()
        .label(GENERAL.LABELS.AVATAR)
        // uri некорректно валидирует ссылку, поэтому вместо нее custom с методом из validator
        .custom(validation(USER.VALIDATION.AVATAR, 'url')),
      email: Joi.string()
        .label(GENERAL.LABELS.EMAIL)
        .required()
        .custom(validation(USER.VALIDATION.EMAIL, 'email')),
      password: Joi.string().label(GENERAL.LABELS.PASSWORD).required(),
    },
  };

  constructor() {
    this.validationSchema.updateProfile = this.createValidationSchema(
      'create',
      ['name', 'about'],
    );
    this.validationSchema.updateAvatar = this.createValidationSchema(
      'create',
      'avatar',
    );
  }

  schema = new mongoose.Schema<T, M, IUserMethods>(
    {
      name: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true,
        default: DEFAULT.NAME,
      },
      about: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true,
        default: DEFAULT.ABOUT,
      },
      avatar: {
        type: String,
        required: true,
        default: DEFAULT.AVATAR,
      },
      email: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
    },
    // убирает поле __v
    { versionKey: false },
  ).static(
    'findUserByCredentials',
    async function _(email: string, password: string) {
      const user = await this.findOne({ email }, {}, { runValidators: true }).select('+password');
      if (!user || !await bcrypt.compare(password, user.password)) {
        return Promise.reject(new UnauthorizedError(USER.LOGIN[HTTP_CODES.UNAUTHORIZED_401]));
      }
      return user;
    },
  );

  /** метод для создания схемы валидации в {@link validationSchema} на основе существующих полей */
  private createValidationSchema(
    mainField: string,
    nameFields: string[] | string,
    ...otherFields: string[]
  ) {
    const result = {} as TModelSettings<T, M>['validationSchema'][string];
    const fields = (
      typeof nameFields === 'string' ? [nameFields] : nameFields
    ).concat(otherFields || []) as (keyof T)[];
    fields.forEach((field) => {
      result[field] = this.validationSchema[mainField][field];
    });
    return result;
  }

  get model() {
    return mongoose.model<T, M>(this.nameModel, this.schema);
  }
}

export const user = new UserModelSettings();

export default user.model;
