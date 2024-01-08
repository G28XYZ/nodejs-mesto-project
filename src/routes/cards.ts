import { Router } from 'express';

import cardController from '../controllers/cards';

// prettier-ignore
const {
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = cardController;

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
