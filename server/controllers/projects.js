const ProjectModel = require('../models/project');
const TaskModel = require('../models/task');


const projectList = async(req, res) => {
    const user = req.user;

    try {
        const projects = await ProjectModel.find({ owner: user.id }, 'id title createdAt');

        res.json({
            data: projects
        });
    }
    catch(error) {
        res.status(500).json({ error: { ...error } });
    }
}

const lastProjects = async(req, res) => {
    const user = req.user;

    try {
        const projects = await ProjectModel
                .find({ owner: user.id }, 'id title description createdAt')
                .sort('-createdAt')
                .limit(3)
            .exec();

        res.json({
            data: projects
        });
    }
    catch(error) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(error))
        });
    }
}

const createProject = async(req, res) => {
    const { title, description } = req.body;
    const owner = req.user;

    try {
        const project = await ProjectModel.create({
            title, description,
            owner: owner.id
        });

        res.json({
            message: 'Project created successfully',
            data: project
        });
    }
    catch(error) {
        res.status(500).json({ error: { ...error } });
    }
}

const showProject = async(req, res) => {
    const { projectId } = req.params;
    const ownerId = req.user.id;

    try {
        const project = await ProjectModel
                .findOne({ _id: projectId, owner: ownerId })
                .populate('tasks')
            .exec();

        if (!project) {
            return res.status(404).json({
                error: {
                    status: 'PROJECT_NOT_FOUND',
                    message: `Project with ID: ${ projectId } was not found`
                }
            });
        }

        res.json({ data: project });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const updateProject = async(req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;

    try {
        const project = await ProjectModel.findByIdAndUpdate(projectId, { title, description }, { new: true }).exec();

        res.json({
            message: 'Project Updated Successfully',
            data: project
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const deleteProject = async(req, res) => {
    const { projectId } = req.params;

    try {
        const project = await ProjectModel.findById(projectId).exec();
        await TaskModel.deleteMany({ _id: { $in: project.tasks } });
        const deletedProject = await project.delete({ new: true });

        res.json({
            message: 'Project Deleted Successfully',
            data: deletedProject
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const createTask = async(req, res) => {
    const ownerId = req.user.id;
    const { projectId } = req.params;
    const { title } = req.body;
    
    try {
        const project = await ProjectModel.findOne({ owner: ownerId, _id: projectId });
        const task = await TaskModel.create({ title });
        project.tasks = [...project.tasks, task];
        await project.save();

        res.json({
            message: 'Task created successfully',
            data: task
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const updateTask = async(req, res) => {
    const { projectId, taskId } = req.params;
    const { title } = req.body;

    try {
        const task = await TaskModel.findByIdAndUpdate(taskId, { title: title ?? task.title }, { new: true });

        res.json({
            message: 'Task Updated',
            data: task
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const completeTask = async(req, res) => {
    const { taskId } = req.params;

    try {
        const task = await TaskModel.findById(taskId);
        task.completed = !task.completed;
        await task.save();

        res.json({
            message: 'Task Completed',
            data: task
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const deleteTask = async(req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const task = await TaskModel.findByIdAndDelete(taskId, { new: true });

        res.json({
            message: 'Task Deleted',
            taskId: task.id
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}


module.exports = {
    projectList, lastProjects, createProject, showProject, updateProject,
    deleteProject, createTask, updateTask, completeTask, deleteTask
}
