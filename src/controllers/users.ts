import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import ValidationError from '../errors/validation-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';

import catchError from '../utils/decorators';
import { HTTP_CODES, TUserCtrlParams } from '../utils/types';
import {
  DEFAULT_JWT_SECRET,
  DEFAULT_SALT_LENGTH,
  ERROR_MESSAGES,
} from '../utils/constants';

const { USER } = ERROR_MESSAGES;
// prettier-ignore
const { SALT_LENGTH = DEFAULT_SALT_LENGTH, JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;
// prettier-ignore
const {
  CREATED_201,
  UNAUTHORIZED_401,
  BAD_REQUEST_400,
  NOT_FOUND_404,
} = HTTP_CODES;

/** контроллер для {@link User} */
export default class {
  /** получить список всех пользователей */
  @catchError(USER.GET)
  static async getUsers(...[_, res]: TUserCtrlParams) {
    return res.send(await User.find());
  }

  /** получить пользователя по id */
  @catchError(USER.GET, new ValidationError(USER.GET[BAD_REQUEST_400]))
  static async getUser(...[req, res, next]: TUserCtrlParams) {
    const user = await User.findById(req.params.userId);
    return user
      ? res.send(user)
      : next(new NotFoundError(USER.GET[NOT_FOUND_404]));
  }

  /** создать пользователя */
  @catchError(USER.CREATE, new ConflictError())
  static async createUser(...[{ body }, res]: TUserCtrlParams) {
    // prettier-ignore
    const {
      email,
      password,
      ...user
    } = body;
    // prettier-ignore
    const {
      _id,
      name,
      about,
      avatar,
    } = await User.create({
      ...user,
      email,
      password: await bcrypt.hash(password, SALT_LENGTH),
    });

    return res.status(CREATED_201).send({
      _id,
      name,
      about,
      avatar,
      email,
    });
  }

  /** обновить профиль пользователя */
  @catchError(USER.PROFILE)
  static async updateProfile(...[req, res, next]: TUserCtrlParams) {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.PROFILE[NOT_FOUND_404]));

    return res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name,
      about,
    });
  }

  /** обновить аватар пользователя */
  @catchError(USER.AVATAR)
  static async updateAvatar(...[req, res, next]: TUserCtrlParams) {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { avatar },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.AVATAR[NOT_FOUND_404]));

    return res.send({
      _id: user?._id,
      avatar,
      name: user?.name,
      about: user?.about,
    });
  }

  @catchError(USER.LOGIN, new UnauthorizedError(USER.LOGIN[UNAUTHORIZED_401]))
  static async login(...[req, res]: TUserCtrlParams) {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('JWT', token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send({ token });
  }
}
