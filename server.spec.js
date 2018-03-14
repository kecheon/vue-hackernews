import request from 'supertest' // #A
import app from './server'

test('/top returns 200', () => {
  return request(app) // #B
    .get('/top') // #C
    .expect(200)
})

test('returns a 404 when page does not exist', () => {
  return request(app)
    .get('/does-not-exist')
    .expect(404)
    .expect(res => {
      expect(res.text).toMatchSnapshot()
    })
})
