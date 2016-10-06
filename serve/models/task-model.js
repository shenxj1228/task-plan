const Model = require('../libraries/model');
const TaskSchema = require('../schemas/task-schema');
const moment = require('moment')
    // Business Model layer, in this instance you can manage your business logic. For example,
    // if you want to create a pet before creating a person, because you'll end up adding that
    // pet to the person, this is the place.

// In libraries/model you have the basic support for RESTful methods. Because this class
// is extending from there, you got that solved.
// You can overwrite extended methods or create custom ones here. Also you can support
// more mongoose functionality like skip, sort etc.

class TaskModel extends Model {
    create(input) {
        input.planStartTime = moment(input.planStartTime, 'YYYY-MM-DD');
        input.planEndTime = moment(input.planEndTime, 'YYYY-MM-DD');
        const newSchemaModel = new this.SchemaModel(input);
        return newSchemaModel.saveAsync();
    };
    getTaskByMonth(req, res) {
        return TaskSchema.aggregate([{
                $match: {
                    deal_account: req.account,
                }
            }, {
                $group: {
                    _id:null,
                    count: {
                        $sum: 1
                    }
                }
            }, {
                $project: {
                    total: 1,
                    month: {
                        $month: "$realEndTime"
                    },
                    _id: 0
                }
            }])
            .execAsync();
    }
}

module.exports = new TaskModel(TaskSchema);
