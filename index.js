const express = require("express");

const server = express();
server.use(express.json());

const projects = [];


// Middleware local para validar se o ID informado existe (utilizado em POST, PUT, DELETE)
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
  
    if (!project) {
      return res.status(400).json({ erro: 'Projeto não encontrado' });
    }
  
    return next();
  }

// Middleware global, contador de requisições
  function logRequests(req, res, next) {

    console.count("Número de requisições");
  
    return next();
  }
  
  server.use(logRequests);

//Criar um projeto novo
server.post('/projects', (req, res)=>{
const { id , title} = req.body;

const project = {
    id,
    title,
    task : []
}

projects.push(project);
return res.jsonp(projects);

});

server.get('/projects', (req, res) =>{

    return res.json(projects);

});

// Vai alterar um projeto existente
server.put('/projects/:id', checkProjectExists, (req, res)=>{
  const { id } = req.params;
  const { title } = req.body;
  
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);

});

// Vai excluir um projeto existente
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
  
    const projectIndex = projects.findIndex(p => p.id == id);
  
    projects.splice(projectIndex, 1);
  
    return res.json(projects);
  });


// Adicionar uma tarefa para um projeto especifico
  server.post('/projects/:id/tasks', checkProjectExists,  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    const project = projects.find(p => p.id == id);
  
    project.tasks.push(title);
  
    return res.json(project);
  });  


server.listen(3200);