const request = require('supertest');

const URL= 'http://localhost:3000'

describe('GET /', () => {

    it('login failure', (done) => {
        request(URL)
            .post("/user/login")
            .send({email: 'abylay@gmail.com', password: '12345678910'})
            .expect(401)
            .expect({ message: 'Invalid email or password' }, done);
    });

    it('login success', (done) => {
        request(URL)
            .post("/user/login")
            .send({email: "abylay@gmail.com", password: "12345678"})
            .expect(200, done)
    });

    it('submits feedback', (done) => {
        request(URL)
            .post('/submit-feedback')
            .send({
                userId: '65e032604674d63b8e9ab37d',
                message: 'This is a test feedback'
            })
            .expect(201, done)
    });

    it('buys seats', (done) => {
        request(URL)
            .post('/boughtSeats')
            .send({
                userId: '65e032604674d63b8e9ab37d',
                movieId: "1096197",
                date: '2024-02-27',
                time: '20:00',
                seats: ['s21', 's22']
            })
            .expect(201, done)
    });

    it('fetches booked seats', (done) => {
        request(URL)
            .get(`/bookedSeats/1096197/2024-02-27/20:00`)
            .expect(200, done)
    });
});
