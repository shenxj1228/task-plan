const controllers = require('./controllers');

const Router = require('express').Router;
const router = new Router();


router.get('/', (req, res) => {
  res.json({ message: 'Welcome to task-plan API!' });
});

router.route('/user')
  .get((...args) => controllers.user.find(...args))
  .post((...args) => controllers.user.create(...args));

router.route('/user/:id')
  .put((...args) => controllers.user.update(...args))
  .get((...args) => controllers.user.findById(...args))
  .delete((...args) => controllers.user.remove(...args));


router.route('/pet')
  .get((...args) => controllers.pet.find(...args))
  .post((...args) => controllers.pet.create(...args));

router.route('/pet/:id')
  .put((...args) => controllers.pet.update(...args))
  .get((...args) => controllers.pet.findById(...args))
  .delete((...args) => controllers.pet.remove(...args));


module.exports = router;
