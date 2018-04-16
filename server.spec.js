import request from 'supertest'
import app from './server'

test('/top returns 200', () => {
  return request(app)
    .get('/top')
    .expect(200)
})

test('returns a 404 when page does not exist', () => {
  return request(app)
    .get('/does-not-exist')
    .expect(404)
    // .expect(res => {
    //   console.log(res.text);
    //   expect(res.text).toMatchSnapshot()
    // })
})
