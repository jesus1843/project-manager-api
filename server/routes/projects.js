const express = require('express');
const router = express.Router();

const ProjectController = require('../controllers/projects');

router
    .get('', ProjectController.projectList)
    .post('', ProjectController.createProject)
    .get('/last-projects', ProjectController.lastProjects)

    .get('/:projectId', ProjectController.showProject)
    .put('/:projectId', ProjectController.updateProject)
    .delete('/:projectId', ProjectController.deleteProject)

    .post('/:projectId/tasks', ProjectController.createTask)
    .put('/:projectId/tasks/:taskId', ProjectController.updateTask)
    .put('/:projectId/tasks/:taskId/complete', ProjectController.completeTask)
    .delete('/:projectId/tasks/:taskId', ProjectController.deleteTask);


module.exports = router;
