import mongoose from 'mongoose';

import { Joi } from 'celebrate';
import { IUser, TModelSettings } from '../utils/types';
import { ERROR_MESSAGES } from '../utils/constants';
import validation from '../utils/validation';

const { USER, GENERAL } = ERROR_MESSAGES;

/**
 * модель настроек для пользователя с схемами модели данных и ее валидации
 */
// prettier-ignore next-line
class UserModelSettings<T extends IUser> implements TModelSettings<T> {
  nameModel = 'user';

  validationSchema: Record<string, Joi.PartialSchemaMap<T>> = {
    /** схема для валидации при создании пользователя */
    create: {
      name: Joi.string()
        .label(GENERAL.LABELS.USERNAME)
        .min(2)
        .rule({ message: USER.VALIDATION.NAME })
        .max(30)
        .rule({ message: USER.VALIDATION.NAME })
        .required(),
      about: Joi.string()
        .label(GENERAL.LABELS.ABOUT)
        .min(2)
        .rule({ message: USER.VALIDATION.ABOUT })
        .max(30)
        .rule({ message: USER.VALIDATION.ABOUT })
        .required(),
      avatar: Joi.string()
        .label(GENERAL.LABELS.AVATAR)
        .required()
        // uri некорректно валидирует ссылку, поэтому вместо нее custom с методом из validator
        .custom(validation(USER.VALIDATION.AVATAR, 'url')),
      email: Joi.string()
        .required()
        .custom(validation(USER.VALIDATION.EMAIL, 'email')),
      password: Joi.string().required(),
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

  schema = new mongoose.Schema<T>(
    {
      name: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true,
      },
      about: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
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
  );

  /** метод для создания схемы валидации в {@link validationSchema} на основе существующих полей */
  private createValidationSchema(
    mainField: string,
    nameFields: string[] | string,
    ...otherFields: string[]
  ) {
    const result = {} as TModelSettings<T>['validationSchema'][string];
    const fields = (
      typeof nameFields === 'string' ? [nameFields] : nameFields
    ).concat(otherFields || []) as (keyof T)[];
    fields.forEach((field) => {
      result[field] = this.validationSchema[mainField][field];
    });
    return result;
  }

  get model() {
    return mongoose.model<T>(this.nameModel, this.schema);
  }
}

export const user = new UserModelSettings();

export default user.model;
