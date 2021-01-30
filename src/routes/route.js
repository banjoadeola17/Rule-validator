const express = require('express');

const router = express.Router();
const { getController, postController } = require('../controller/controller');

const { validator } = require('../validator/validator');

const schemaValidator = (Schema) => {
    function validateErrorMessage(errorData) {
      let err = errorData[0].replace(/"/g, '');
      err = err.replace(/must be of type/g, 'should be an');
      return `${err}.`;
    }
  
    // eslint-disable-next-line consistent-return
    return (req, _res, next) => {
      try {
        const { error } = Schema.validate(req.body);
        if (!error) return next();
        const err = new Error('Error.');
        err.data = validateErrorMessage(error.details.map((errorObject) => errorObject.message));
        err.statusCode = 400;
        next(err);
      } catch (error) {
        next(error);
      }
    };
  };

router.get('/', getController);
router.post('/validate-rule', schemaValidator(validator), postController);

module.exports = router;