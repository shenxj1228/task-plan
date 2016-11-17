const controllers = require('./controllers');

const Router = require('express').Router;
const router = new Router();

const auth = require('./middlewares/auth.js');
const menu = require('./middlewares/menu.js');
const user = require('./middlewares/user.js');

const version = '/api/v1';
router.get(version, (req, res) => {
    res.json({ message: 'Welcome to task-plan API!' });
});

router.post('/login', auth.login);

router.get('/menus', menu.list);

router.route(version + '/task-group-month')
    .get((...args) => controllers.task.getTaskByMonth(...args));

router.route(version + '/task-group-day')
    .get((...args) => controllers.task.getTaskByDay(...args));

router.route(version + '/active-project/:id')
    .post((...args) => controllers.project.active(...args));

router.route(version + '/user')
    .get((...args) => controllers.user.find(...args))
    .post((...args) => controllers.user.create(...args));

router.route(version + '/user/:id')
    .put((...args) => controllers.user.update(...args))
    .get((...args) => controllers.user.findById(...args))
    .delete((...args) => controllers.user.remove(...args));

router.route('/user/:id/avatar')
    .get((...args) => user.getAvatar(...args))
    .post((...args) => user.saveAvatar(...args));

router.route(version + '/project')
    .get((...args) => controllers.project.find(...args))
    .post((...args) => controllers.project.create(...args));

router.route(version + '/project/:id')
    .put((...args) => controllers.project.update(...args))
    .get((...args) => controllers.project.findById(...args))
    .delete((...args) => controllers.project.remove(...args));

router.route(version + '/task')
    .get((...args) => controllers.task.find(...args))
    .post((...args) => controllers.task.create(...args))
    .put((...args) => controllers.task.update(...args))
    .delete((...args) => controllers.task.remove(...args));

router.route(version + '/task/:id')
    .put((...args) => controllers.task.update(...args))
    .get((...args) => controllers.task.findById(...args))
    .delete((...args) => controllers.task.remove(...args));

router.route(version + '/journal')
    .get((...args) => controllers.journal.find(...args))
    .post((...args) => controllers.journal.create(...args))
    .put((...args) => controllers.journal.update(...args));

router.route(version + '/journal/:id')
    .put((...args) => controllers.journal.update(...args))
    .get((...args) => controllers.journal.findById(...args))
    .delete((...args) => controllers.journal.remove(...args));

module.exports = router;
