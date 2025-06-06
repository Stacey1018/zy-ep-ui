import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HlButton/index.vue'),
    },
    {
      path: '/hlbutton',
      name: 'hlbutton',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HlButton/index.vue'),
    },
    {
      path: '/hlbasebutton',
      name: 'hlbasebutton',
      component: () => import('../views/HlBaseButton/index.vue'),
    },
    {
      path: '/hlcropping',
      name: 'hlcropping',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HlCropping/index.vue'),
    },
    {
      path: '/hlpdfviewer',
      name: 'hlpdfviewer',
      component: () => import('../views/HlPdfViewer/index.vue'),
    },
  ],
})

export default router
