import Path from 'path';
import express from 'express';
const routes = express.Router();

routes.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(Path.resolve('views', 'index.html'));
});

export default routes;
