import { shallow } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar.vue', () => {
  test('has no show class onn initial render', () => {
    const wrapper = shallow(ProgressBar)
    expect(wrapper.classes()).not.toContain('show')
  })

  test('initializes with 0% width', () => {
    const wrapper = shallow(ProgressBar)
    expect(wrapper.element.style.width).toBe('0%')
  })

  test('sets .progress width as same value of vm.percentage', () => {
    const wrapper = shallow(ProgressBar)
    const percent = 70
    wrapper.setData({ percent })
    expect(wrapper.element.style.width).toBe(`${percent}%`)
  })

  test('renders element with width 0% when start is called', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.setData({ percent: 70 })
    wrapper.vm.start()
    wrapper.update()
    expect(wrapper.element.style.width).toBe('0%')
  })

  test('adds class show when start is called', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.vm.start()
    wrapper.update()
    expect(wrapper.classes()).toContain('show')
  })

  test('adds class error when fail is called', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.vm.fail()
    wrapper.update()
    expect(wrapper.classes()).toContain('error')
  })

  test('renders element with width 100% when fail is called', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.vm.fail()
    wrapper.update()
    expect(wrapper.element.style.width).toBe('100%')
  })

  test('removes class show when finish is called', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.vm.start()
    wrapper.vm.finish()
    wrapper.update()
    expect(wrapper.classes()).not.toContain('show')
  })

  test('sets width to 100% when finish is called ', () => {
    const wrapper = shallow(ProgressBar)
    wrapper.vm.finish()
    wrapper.update()
    expect(wrapper.element.style.width).toBe('100%')
  })

  test('increases width by 1% every 100ms after start call', () => {
    jest.useFakeTimers()
    const wrapper = shallow(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(100)
    wrapper.update()
    expect(wrapper.element.style.width).toBe('1%')
    jest.runTimersToTime(900)
    wrapper.update()
    expect(wrapper.element.style.width).toBe('10%')
    jest.runTimersToTime(4000)
    wrapper.update()
    expect(wrapper.element.style.width).toBe('50%')
    jest.useRealTimers()
  })

  test('clears _timer when start is called', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
    const timerStub = 'timerStub'
    const wrapper = shallow(ProgressBar)
    wrapper.vm._timer = timerStub
    wrapper.vm.finish()
    expect(clearIntervalSpy.mock.calls[0][0]).toBe(timerStub)
    clearIntervalSpy.mockRestore()
  })
})
