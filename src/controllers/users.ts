import { HTTP_CODES, TControllerParameters } from '../utils/types';
import User from '../models/user';
import catchError from '../utils/decorators';
import NotFoundError from '../errors/not-found-error';
import ValidationError from '../errors/validation-error';
import { ERROR_MESSAGES } from '../utils/constants';

const { USER } = ERROR_MESSAGES;

/** контроллер для {@link User} */
export default class {
  /** получить список всех пользователей */
  @catchError(USER.GET)
  static async getUsers(...[_, res]: TControllerParameters) {
    return res.send(await User.find());
  }

  /** получить пользователя по id */
  @catchError(USER.GET, new ValidationError(USER.GET[404]))
  static async getUser(...[req, res]: TControllerParameters) {
    return res.send(await User.findById(req.params.userId));
  }

  /** создать пользователя */
  @catchError(USER.CREATE)
  static async createUser(...[req, res]: TControllerParameters) {
    const { name, about, avatar } = req.body;
    await User.create({ name, about, avatar });
    return res.status(HTTP_CODES.CREATED_201).send({ name, about, avatar });
  }

  /** обновить профиль пользователя */
  @catchError(USER.PROFILE)
  static async updateProfile(...[req, res, next]: TControllerParameters) {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.PROFILE[404]));

    return res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name,
      about,
    });
  }

  /** обновить аватар пользователя */
  @catchError(USER.AVATAR)
  static async updateAvatar(...[req, res, next]: TControllerParameters) {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { avatar },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.AVATAR[404]));

    return res.send({
      _id: user?._id,
      avatar,
      name: user?.name,
      about: user?.about,
    });
  }
}
