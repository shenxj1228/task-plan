const Controller = require('../libraries/controller');
const TaskModel = require('../models/task-model');
const ProjectModel = require('../models/project-model');

// HTTP layer, in this instance you can manage express request, response and next.
// In libraries/controller you have the basic RESTful methods find, findOne, findById,
// create, update and remove. Because this class is extending from there, you got that solved.
// You can overwrite extended methods or create custom ones here.

class TaskController extends Controller {

    // Example of overwriting update method using findOneAndUpdate from mongoose

    // update(req, res, next) {
    //  this.model.findOneAndUpdate({ _id: req.params.id }, req.body)
    //  .then(doc => {
    //      if (!doc) res.status(404).send();
    //      return res.status(200).json(doc);
    //  })
    //  .catch(err => next(err));
    // }
    getTaskByMonth(req, res, next) {
        if (req.query.queryUser)
            req.query.filter.dealAccount = req.query.queryUser.account;
        this.model.getTaskByMonth(req.query.filter).then(docs => {
                return res.status(200).json(docs);
            })
            .catch(err => next(err))
    }
    getTaskByDay(req, res, next) {
        if (req.query.queryUser)
            req.query.filter.dealAccount = req.query.queryUser.account;
        this.model.getTaskByDay(req.query.filter).then(docs => {
                return res.status(200).json(docs);
            })
            .catch(err => next(err))
    }

    projectRateGroupbyColumn(req, res, next) {
            let query = {};
            let groupbyColumn = '',showColumn='';

            if (req.query && req.query.groupbyColumn != '') {
                groupbyColumn = req.query.groupbyColumn;
                
            } else {
                return res.status(404).send({ status: 404, message: '没有分组字段【groupbyColumn】' });
            }
            if(req.query&&req.query.showColumn!=''){
               showColumn=req.query.showColumn;
            }
            delete req.query.groupbyColumn;
            delete req.query.showColumn;
            query = req.query;
            if (req.params.projectId != '') {
                query.projectId = req.params.projectId;
               
            } else {
                return res.status(404).send({ status: 404, message: '没有项目ID【projectId】' });
            } 
            this.model.projectRateGroupbyColumn(query, groupbyColumn,showColumn).then(docs => {
                    if (docs.length < 1)
                        return res.status(404).send();
                    return res.status(200).json(docs);
                })
                .catch(err => next(err));

        }
        // Example of a custom method. Remember that you can use this method
        // in a specific route in the router file

    // customMethod(req, res, next) {
    //  this.model.geoNear([1,3], { maxDistance : 5, spherical : true })
    //  .then(doc => {
    //      if (!doc) res.status(404).send();
    //      return res.status(200).json(doc);
    //  })
    //  .catch(err => next(err));
    // }
}

module.exports = new TaskController(TaskModel);
