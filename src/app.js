import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import storeConfig from './store/store-config'
import routerConfig from './router/router-config'
import {titleMixin} from './util/mixins'
import {
  timeAgo,
  host
} from './util/filters'

// mixin for handling title
Vue.mixin(titleMixin)

// register global utility filters.
Vue.filter('timeAgo', timeAgo)
Vue.filter('host', host)

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  Vue.use(Vuex)
  Vue.use(Router) // #B

  const router = new Router(routerConfig)
  const store = new Vuex.Store(storeConfig)

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
