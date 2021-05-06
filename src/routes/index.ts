import Path from "path";
import express from 'express';
const routes = express.Router();

routes.get('/', (req, res) => {
    res.sendFile(Path.join(__dirname, "index.html"));
});

export default routes;
