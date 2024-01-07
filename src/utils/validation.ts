import { Joi } from 'celebrate';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

export default function validation(
  message: string,
  typeValidation: 'email' | 'url',
) {
  return (value: string, helpers: Joi.CustomHelpers) => {
    // prettier-ignore
    switch (typeValidation) {
      case 'email': if (isEmail(value)) return value; break;
      case 'url': if (isURL(value)) return value; break;
      default: break;
    }
    return helpers.message({ custom: message });
  };
}
