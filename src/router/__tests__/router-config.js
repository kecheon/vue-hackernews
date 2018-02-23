import { createLocalVue } from '@vue/test-utils'
import Router from 'vue-router'
import routerConfig from '../router-config'
import ItemList from '../../views/ItemList.vue'

describe('routes', () => {
  test('/ returns an ItemList with property top', () => {
    const localVue = createLocalVue()
    localVue.use(Router) // #A
    const router = new Router(routerConfig) // #B
    router.push('/') // #C
    const matchedComponent = router.getMatchedComponents()[0] // #D
    const matchedComponentProps = router.currentRoute.matched[0].props.default // #E
    expect(matchedComponent).toBe(ItemList) // #F
    expect(matchedComponentProps.type).toBe('top') // #G
  })

  test('/top/ returns an ItemList with property top', () => {
    const localVue = createLocalVue()
    localVue.use(Router)
    const router = new Router(routerConfig)
    router.push('/top/')// #H
    const matchedComponent = router.getMatchedComponents()[0]
    expect(matchedComponent).toBe(ItemList)
  })

  test('/top/1 returns an ItemList with property top, and page param of 1', () => {
    const localVue = createLocalVue()
    localVue.use(Router)
    const router = new Router(routerConfig)
    router.push('/top/1') // #I
    const matchedComponent = router.getMatchedComponents()[0]
    expect(matchedComponent).toBe(ItemList)
    expect(router.currentRoute.params.page).toBe('1') // #J
  })
})
