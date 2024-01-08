import mongoose, { Model } from 'mongoose';
import { Joi } from 'celebrate';

import { ICard, TModelSettings } from '../utils/types';
import { user } from './user';
import { ERROR_MESSAGES } from '../utils/constants';
import validation from '../utils/validation';

const { CARD, GENERAL } = ERROR_MESSAGES;

/**
 * модель настроек для карточки с схемами модели данных и ее валидации
 */
// prettier-ignore
class CardModelSettings<T extends ICard, M extends Model<T>> implements TModelSettings<T, M> {
  nameModel = 'card';

  validationSchema = {
    /** схема для валидации при создании карточки */
    create: {
      name: Joi.string()
        .label(GENERAL.LABELS.CARD_NAME)
        .min(2)
        .rule({ message: CARD.VALIDATION.NAME })
        .max(30)
        .rule({ message: CARD.VALIDATION.NAME })
        .required(),
      link: Joi.string()
        .label(GENERAL.LABELS.LINK)
        .min(2)
        .required()
        // uri некорректно валидирует ссылку, поэтому вместо нее custom с методом из validator
        .custom(validation(CARD.VALIDATION.LINK, 'url')),
    },
  };

  schema = new mongoose.Schema<T>(
    {
      name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
      },
      link: {
        type: String,
        required: true,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user.nameModel,
        required: true,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: user.nameModel,
          default: [],
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    // убирает поле __v
    { versionKey: false },
  );

  get model() {
    return mongoose.model<T>(this.nameModel, this.schema);
  }
}

export const card = new CardModelSettings();

export default card.model;
