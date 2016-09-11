const Controller = require('../libraries/controller');
const UserModel = require('../models/user-model');

// HTTP layer, in this instance you can manage express request, response and next.
// In libraries/controller you have the basic RESTful methods find, findOne, findById,
// create, update and remove. Because this class is extending from there, you got that solved.
// You can overwrite extended methods or create custom ones here.

class UserController extends Controller {

    // Example of overwriting update method using findOneAndUpdate from mongoose

    // update(req, res, next) {
    // 	this.model.findOneAndUpdate({ _id: req.params.id }, req.body)
    // 	.then(doc => {
    // 		if (!doc) res.status(404).send();
    // 		return res.status(200).json(doc);
    // 	})
    // 	.catch(err => next(err));
    // }
    create(req, res, next) {
            this.model.find({ account: req.body.account }).then(array => {
                    console.log(array);
                    if (array.length != 0) {
                        return res.status(202).json({ error: '违反唯一性约束', message: '账户：' + req.body.account + '已经存在' });
                    } else {
                        UserModel.create(req.body)
                            .then(doc => res.status(201).json(doc));
                    }
                })
                .catch(err => next(err));
        }
        // Example of a custom method. Remember that you can use this method
        // in a specific route in the router file

    // customMethod(req, res, next) {
    // 	this.model.geoNear([1,3], { maxDistance : 5, spherical : true })
    // 	.then(doc => {
    // 		if (!doc) res.status(404).send();
    // 		return res.status(200).json(doc);
    // 	})
    // 	.catch(err => next(err));
    // }
}

module.exports = new UserController(UserModel);
