const milieu = require('milieu');
const menus=[{state:'home.index',name: '首    页'},{state:'home.work',name: '工作内容'},{state:'home.schedule',name:'工作进度'},{state:'home.operate',name:'个人操作'},{state:'home.info',name:'个人信息'},{state:'home.project',name:'项目管理'},{state:'home.task',name:'任务管理'},{state:'home.user',name:'用户管理'}];
const rolemenu = milieu('task-plan', {
	'1':menus.slice(-5),
	'2':menus.slice(0,5),
	'3':menus.slice(0,5),
	'4':menus.slice(0,5),
	'5':menus.slice(0,5),
	'6':menus.slice(0,5),
	'7':menus.slice(0,5),
	'8':menus.slice(0,5),
	'9':menus.slice(0,5),
	'10':menus.slice(0,5)
});


module.exports = rolemenu;