import { mount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar.vue', () => {
  test('initializes with 0% width', () => {
    const wrapper = mount(ProgressBar)
    expect(wrapper.hasStyle('width', '0%')).toBe(true)
  })

  test('sets .progress width as same value of vm.percentage', () => {
    const wrapper = mount(ProgressBar)
    const percent = 70
    wrapper.setData({ percent })
    expect(wrapper.element.style.width).toBe(`${percent}%`)
  })

  test('has class show when show is true', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ show: true }) // #A set Vue instance state
    expect(wrapper.element.className).toContain('show')
  })

  test('does not have class show when show is false', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ show: false })
    expect(wrapper.element.className).not.toContain('show')
  })

  test('has class error when error is true', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: true })
    expect(wrapper.element.className).toContain('error') // #A
  })

  test('does not have class error when error is false', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: false })
    expect(wrapper.element.className).not.toContain('error')
  })

  test('sets this.show to true when start is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ show: false })
    wrapper.vm.start()
    expect(wrapper.vm.show).toBe(true)
  })

  test('sets this.error to false when start is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: true })
    wrapper.vm.start()
    expect(wrapper.vm.error).toBe(false)
  })

  test('sets this.error to false when start is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: true })
    wrapper.vm.start()
    expect(wrapper.vm.error).toBe(false)
  })

  test('sets this.percent to 100 when finish is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ percent: 10 })
    wrapper.vm.finish()
    expect(wrapper.vm.percent).toBe(100)
  })

  test('sets this.show to false when finish', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ show: true })
    wrapper.vm.finish()
    expect(wrapper.vm.show).toBe(false)
  })

  test('increases width to 10% 1 second after start is called', () => {
    jest.useFakeTimers()
    const wrapper = mount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(1000)
    expect(wrapper.vm.percent).toBe(10)
  })

  test('increases width to 50% 5 second after start is called', () => {
    jest.useFakeTimers()
    const wrapper = mount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(5000)
    expect(wrapper.vm.percent).toBe(50)
  })

  test('sets this.error to true when fail is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: false })
    wrapper.vm.fail()
    expect(wrapper.vm.error).toBe(true)
  })

  test('sets this.error to true when fail is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.setData({ error: false })
    wrapper.vm.fail()
    expect(wrapper.vm.error).toBe(true)
  })

  test('clears _timer when finish is called', () => {
    const spy = jest.spyOn(window, 'clearInterval')
    const timerStub = 'timerStub'
    const wrapper = mount(ProgressBar)
    wrapper.vm._timer = timerStub
    wrapper.vm.finish()
    expect(spy.mock.calls[0][0]).toBe(timerStub)
    spy.mockReset()
    spy.mockRestore()
  })

  test('clears _timer when stqrt is called', () => {
    const spy = jest.spyOn(window, 'clearInterval')
    const timerStub = 'timerStub'
    const wrapper = mount(ProgressBar)
    wrapper.vm._timer = timerStub
    wrapper.vm.start()
    expect(spy.mock.calls[0][0]).toBe(timerStub)
    spy.mockReset()
    spy.mockRestore()
  })

  test('renders in an in progress state when start is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(1000)
    wrapper.update()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders in a success state when finish is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(1000)
    wrapper.vm.finish()
    wrapper.update()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders in an error state when fail  is called', () => {
    const wrapper = mount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(1000)
    wrapper.vm.fail()
    wrapper.update()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
