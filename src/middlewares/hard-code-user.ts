import { TControllerParameters } from '../utils/types';

const defineUser = (...[req, _, next]: TControllerParameters) => {
  req.user = {
    _id: '659581da16f52c86a1e4ab25', // user1
    // _id: '659624ecaebfc7182a2196b9', // user2
    // _id: '659624ecaebfc7182a2196b7', // fake user
  };
  return next();
};

export default defineUser;
