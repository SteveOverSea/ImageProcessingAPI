import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('testing / endpoint', () => {
    it('gets the / endpoint', async () => {
        const response = await request.get(
            '/'
        );
        expect(response.status).toBe(200);
    });
});