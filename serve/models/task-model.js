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
    getTaskByMonth(query) {
        return TaskSchema.aggregate([{
                $match: query
            }, {
                $group: {
                    _id: { $avg: { '$month': '$realEndTime' } },
                    count: { $sum: 1 }
                }
            }, {
                $project: {
                    _id: 0,
                    month: '$_id',
                    count: 1
                }
            }])
            .execAsync();
    };
    getTaskByDay(query) {
        return TaskSchema.aggregate([{
                $match: query
            }, {
                $group: {
                    _id: { $avg: { '$dayOfMonth': '$realEndTime' } },
                    count: { $sum: 1 }
                }
            }, {
                $project: {
                    _id: 0,
                    day: '$_id',
                    count: 1
                }
            }])
            .execAsync();
    }
}

module.exports = new TaskModel(TaskSchema);
