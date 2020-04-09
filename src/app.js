const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// middleware
function validateRepoId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid ID" });

  return next();
}

app.use("/repositories/:id", validateRepoId);

const repositories = [];
const likes = 0;

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);

  if (!repoIndex)
    return response.status(400).json({ error: "Repository not found" });

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((r) => r.id === id);

  if (!repository)
    return response.status(400).json({ error: "Repository not found" });

  repository.likes++;

  return response.status(200).json(repository);
});

module.exports = app;
