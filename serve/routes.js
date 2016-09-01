const controllers = require('./controllers');

const Router = require('express').Router;
const router = new Router();


router.get('/api', (req, res) => {
  res.json({ message: 'Welcome to task-plan API!' });
});

router.route('/api/user')
  .get((...args) => controllers.user.find(...args))
  .post((...args) => controllers.user.create(...args));

router.route('/api/user/:id')
  .put((...args) => controllers.user.update(...args))
  .get((...args) => controllers.user.findById(...args))
  .delete((...args) => controllers.user.remove(...args));


router.route('/api/pet')
  .get((...args) => controllers.pet.find(...args))
  .post((...args) => controllers.pet.create(...args));

router.route('/api/pet/:id')
  .put((...args) => controllers.pet.update(...args))
  .get((...args) => controllers.pet.findById(...args))
  .delete((...args) => controllers.pet.remove(...args));

router.route('/api/project')
  .get((...args) => controllers.pet.find(...args))
  .post((...args) => controllers.pet.create(...args));

router.route('/api/project/:id')
  .put((...args) => controllers.pet.update(...args))
  .get((...args) => controllers.pet.findById(...args))
  .delete((...args) => controllers.pet.remove(...args));

  router.route('/api/task')
  .get((...args) => controllers.pet.find(...args))
  .post((...args) => controllers.pet.create(...args));

router.route('/api/task/:id')
  .put((...args) => controllers.pet.update(...args))
  .get((...args) => controllers.pet.findById(...args))
  .delete((...args) => controllers.pet.remove(...args));

  router.route('/api/journal')
  .get((...args) => controllers.pet.find(...args))
  .post((...args) => controllers.pet.create(...args));

router.route('/api/journal/:id')
  .put((...args) => controllers.pet.update(...args))
  .get((...args) => controllers.pet.findById(...args))
  .delete((...args) => controllers.pet.remove(...args));

module.exports = router;
