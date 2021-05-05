import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('testing endpoints', () => {
    it('gets the api/image endpoint with the correct input', async (done) => {
        
        const response = await request.get(
            '/api/image?filename=fjord&width=200&height=200'
        );
        expect(response.status).toBe(200);
        done();
    });
});
