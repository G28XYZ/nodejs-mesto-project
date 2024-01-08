import Card from '../models/card';
import ValidationError from '../errors/validation-error';
import NotFoundError from '../errors/not-found-error';

import catchError from '../utils/decorators';
import { ERROR_MESSAGES } from '../utils/constants';
import { HTTP_CODES, TCardCtrlParams } from '../utils/types';

const { CARD } = ERROR_MESSAGES;
const { BAD_REQUEST_400, NOT_FOUND_404 } = HTTP_CODES;

/** контроллер для {@link Card} */
export default class {
  /** получить массив всех карточек */
  @catchError()
  static async getCards(...[_, res]: TCardCtrlParams) {
    return res.send(await Card.find());
  }

  /** создать карточку */
  @catchError(CARD.CREATE, new ValidationError(CARD.CREATE[BAD_REQUEST_400]))
  static async createCard(...[req, res]: TCardCtrlParams) {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(HTTP_CODES.CREATED_201).send(card);
  }

  /** удалить карточку */
  @catchError(CARD.DELETE, new ValidationError(CARD.DELETE[NOT_FOUND_404]))
  static async deleteCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findById(req.params.cardId);

    if (!card) return next(new NotFoundError(CARD.DELETE[BAD_REQUEST_400]));

    if (req.user?._id === card.owner.toString()) {
      return res.send(await Card.findByIdAndDelete(req.params.cardId));
    }
    return next(new NotFoundError(CARD.DELETE[NOT_FOUND_404]));
    // return next(new ForbiddenError(CARD.DELETE[FORBIDDEN_403])); // TODO
  }

  /** поставить лайк карточке */
  @catchError(CARD.LIKE, new ValidationError(CARD.LIKE[BAD_REQUEST_400]))
  static async likeCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) return next(new NotFoundError(CARD.LIKE[NOT_FOUND_404]));

    return res.send(card);
  }

  /** удалить лайк */
  @catchError(CARD.LIKE, new ValidationError(CARD.LIKE[BAD_REQUEST_400]))
  static async dislikeCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) return next(new NotFoundError(CARD.LIKE[NOT_FOUND_404]));

    return res.send(card);
  }
}
