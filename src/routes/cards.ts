import { Router } from 'express';
import { Segments } from 'celebrate';

import cardController from '../controllers/cards';
import { card } from '../models/card';
import validator from '../middlewares/validator';

// prettier-ignore
const {
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  createCard,
} = cardController;

const router = Router();

router.get('/', getCards);
router.post(
  '/',
  validator(Segments.BODY, card.validationSchema.create),
  createCard,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
