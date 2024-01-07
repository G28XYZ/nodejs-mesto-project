import { Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { Types, model, Schema } from 'mongoose';

export type TController = Record<
  string,
  (
    req: Request & Partial<{ user: { _id: string } }>,
    res: Response,
    next: NextFunction,
  ) => Promise<any> | any
>;
/** тип для параметров контроллера */
export type TControllerParameters = Parameters<TController[string]>;

export type TDecoratorMethod = (
  target: Function,
  name: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export type TErrorHandler = <E extends Error>(
  err: E & Request,
  ...args: TControllerParameters
) => any;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: ICard['owner'][];
  createdAt: Date;
}
/** поля для класса настроек модели */
export type TModelSettings<T> = {
  /** наименование модели */
  nameModel: string;
  /** схема валидации */
  validationSchema: Record<string, Joi.PartialSchemaMap<T>>;
  /** схема модели */
  schema: Schema<T>;
  /** модель */
  get model(): ReturnType<typeof model>;
};

/**
 * @see {@link https://ru.wikipedia.org/wiki/Список_кодов_состояния_HTTP}
 * коды ошибок по типу
 */
// eslint-disable-next-line no-shadow
export enum HTTP_CODES {
  OK_200 = 200,
  CREATED_201 = 201,
  BAD_REQUEST_400 = 400,
  UNAUTHORIZED_401 = 401,
  FORBIDDEN_403 = 403,
  NOT_FOUND_404 = 404,
  INTERNAL_SERVER_ERROR_500 = 500,
}
