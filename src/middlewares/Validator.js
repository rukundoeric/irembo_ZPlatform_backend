import 'regenerator-runtime';
import _ from 'lodash';

import { validationSchema as schemas } from '../helpers';

export default (schema) => (req, res, next) => {
  const data = req.body;
  if (_.has(schemas, schema)) {
    const chosenSchema = _.get(schemas, schema);
    const validationResult = chosenSchema.validate(data, {
      abortEarly: false,
    });
    if (!validationResult.error) {
      req.body = data;
      next();
    } else {
      const allErrors = [];
      validationResult?.error?.details?.forEach((error) => {
        allErrors.push(error?.message?.split('"').join(''));
      });
      return res.status(400).json({
        error: { message: allErrors },
      });
    }
  }
};
