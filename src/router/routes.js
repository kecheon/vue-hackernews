import ItemList from '../views/ItemList.vue'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

export default [
  { path: '/top/:page?', component: ItemList, props: {type: 'top'} },
  { path: '/new/:page?', component: ItemList, props: {type: 'new'} },
  { path: '/show/:page?', component: ItemList, props: {type: 'show'} },
  { path: '/ask/:page?', component: ItemList, props: {type: 'ask'} },
  { path: '/job/:page?', component: ItemList, props: {type: 'job'} },
  { path: '/item/:id(\\d+)', component: ItemView },
  { path: '/user/:id', component: UserView },
  { path: '/', redirect: '/top' }
]
