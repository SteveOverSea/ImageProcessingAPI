import express from 'express';
const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('make a query on /api/image/filename=...&width=...&height=..');
});

export default routes;
