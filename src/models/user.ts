import mongoose from 'mongoose';

import { IUser, TModelSettings } from '../utils/types';

/**
 * модель настроек для пользователя с схемами модели данных и ее валидации
 */
// prettier-ignore next-line
class UserModelSettings<T extends IUser> implements TModelSettings<T> {
  nameModel = 'user';

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
    },
    // убирает поле __v
    { versionKey: false },
  );

  get model() {
    return mongoose.model<T>(this.nameModel, this.schema);
  }
}

export const user = new UserModelSettings();

export default user.model;
