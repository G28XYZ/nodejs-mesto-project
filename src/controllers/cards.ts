import { HTTP_CODES, TCardCtrlParams } from '../utils/types';
import Card from '../models/card';
import catchError from '../utils/decorators';
import ValidationError from '../errors/validation-error';
import NotFoundError from '../errors/not-found-error';
import { ERROR_MESSAGES } from '../utils/constants';

// prettier-ignore
const {
  CARD,
} = ERROR_MESSAGES;

/** контроллер для {@link Card} */
export default class {
  /** получить массив всех карточек */
  @catchError()
  static async getCards(...[_, res]: TCardCtrlParams) {
    return res.send(await Card.find());
  }

  /** создать карточку */
  @catchError(CARD.CREATE, new ValidationError(CARD.CREATE[400]))
  static async createCard(...[req, res]: TCardCtrlParams) {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(HTTP_CODES.CREATED_201).send(card);
  }

  /** удалить карточку */
  @catchError(CARD.DELETE, new ValidationError(CARD.DELETE[404]))
  static async deleteCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findById(req.params.cardId);

    if (!card) return next(new NotFoundError(CARD.DELETE[404]));

    if (req.user?._id === card.owner.toString()) {
      return res.send(await Card.findByIdAndDelete(req.params.cardId));
    }
    return next(new NotFoundError(CARD.DELETE[404]));
    // return next(new ForbiddenError(CARD.DELETE[403])); // TODO
  }

  /** поставить лайк карточке */
  @catchError(CARD.LIKE, new ValidationError(CARD.LIKE[400]))
  static async likeCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) return next(new NotFoundError(CARD.LIKE[404]));

    return res.send(card);
  }

  /** удалить лайк */
  @catchError(CARD.LIKE, new ValidationError(CARD.LIKE[400]))
  static async dislikeCard(...[req, res, next]: TCardCtrlParams) {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) return next(new NotFoundError(CARD.LIKE[404]));

    return res.send(card);
  }
}
