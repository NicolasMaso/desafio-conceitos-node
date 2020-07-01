const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const results = title ? repositories.filter(repositorie => repositorie.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

   const repository = {id: uuid(), title, url, techs, likes : 0};

   repositories.push(repository)

   return response.json(repository)


});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

const repositoryId = repositories.findIndex(repository => repository.id === id);

if (repositoryId < 0){
  return response.status(400).json({error: 'Repository not found.'})
}

const repository = {id, title, url, techs, likes: repositories[repositoryId].likes};

repositories[repositoryId] = repository;

return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if(repositoryId < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryId, 1);

  return response.status(204).send('Repository successfully deleted');
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if(repositoryId < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }
 
  const {title, url, techs} = repositories[repositoryId];

  console.log(repositories[repositoryId].likes)

  const likes = repositories[repositoryId].likes+1;
  
  const repository = {id, title, url, techs, likes};

  repositories[repositoryId] = repository;

  return response.json(repository);

});

module.exports = app;
