import supertest from 'supertest';
import app from '../../../index';
import {
    getFileExtension,
    isFilenameOnServer,
} from '../../../routes/api/image';

const request = supertest(app);

describe('testing api/image endpoints', () => {
    it('gets the api/image endpoint with the correct input', async () => {
        const response = await request.get(
            '/api/image?filename=fjord&width=200&height=200'
        );
        expect(response.status).toBe(200);
    });

    it('returns 400 bad request if invalid filename', async () => {
        const response = await request.get(
            '/api/image?filename=asmdkasda&width=200&height=200'
        );
        expect(response.status).toBe(400);
    });

    it('returns 400 bad request if missing height', async () => {
        const response = await request.get(
            '/api/image?filename=fjord&width=200'
        );
        expect(response.status).toBe(400);
    });
});

describe('testing image processing', () => {
    it('should find fjord.jpg on server', async () => {
        expect(await isFilenameOnServer('fjord')).toBe(true);
    });

    it('should not find misspelled fjoooord on server', async () => {
        expect(await isFilenameOnServer('fjoooord')).toBe(false);
    });

    it('should get jpg file extension from fjord', async () => {
        expect(await getFileExtension('fjord')).toEqual('jpg');
    });
});
