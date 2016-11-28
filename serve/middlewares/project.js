const TaskModel = require('../models/task-model');
const ProjectModel = require('../models/project-model');
const project = {
    updateRate: function() {
        TaskModel.projectRateGroupbyColumn({},'projectId').then(docs => {
                if (docs.length < 1) {
                    console.log('更新失败,查询到各个项目进度为空');
                    return;
                }
                docs.forEach(function(ele) {
                    ProjectModel.update(ele.projectId, { rate: ele.totalRate }).then(doc=>{
                    	console.log('_id:'+ele.projectId+',更新成功,进度:'+ele.totalRate+'.');
                    });
                });
            })
            .catch(err => next(err));
    }
}
module.exports = project;
