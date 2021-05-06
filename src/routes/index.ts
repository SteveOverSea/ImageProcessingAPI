import Path from 'path';
import express from 'express';
const routes = express.Router();

routes.get('/', (req, res) => {
    res.sendFile(Path.resolve('views', 'index.html'));
});

export default routes;
