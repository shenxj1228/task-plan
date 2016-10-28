const Model = require('../libraries/model');
const ProjectSchema = require('../schemas/project-schema');


// Business Model layer, in this instance you can manage your business logic. For example,
// if you want to create a pet before creating a person, because you'll end up adding that
// pet to the person, this is the place.

// In libraries/model you have the basic support for RESTful methods. Because this class
// is extending from there, you got that solved.
// You can overwrite extended methods or create custom ones here. Also you can support
// more mongoose functionality like skip, sort etc.

class ProjectModel extends Model {
    active(id) {
        ProjectSchema.update({ isActive: true }, { isActive: false }).execAsync();
        return ProjectSchema.update({ _id: id }, { isActive: true }).execAsync();
    }
}

module.exports = new ProjectModel(ProjectSchema);
