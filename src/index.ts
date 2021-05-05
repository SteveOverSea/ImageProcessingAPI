import express from 'express';
import routes from './routes/index';
import image from './routes/api/image';

const app = express();
const port = 3000;

app.use('/api', routes);
app.use('/api/image', image);

app.listen(port, () => console.log(`Listening on ${port}`));

export default app;
