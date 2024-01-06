import { TControllerParameters } from '../utils/types';

export default function defineUser(...[req, _, next]: TControllerParameters) {
  req.user = {
    _id: '65992ca09b69e9ef07546d9f', // user1
    // _id: '65992c0a1c6b67da5eb07a37', // user2
    // _id: '659624ecaebfc7182a2196b7', // fake user
  };
  return next();
}
