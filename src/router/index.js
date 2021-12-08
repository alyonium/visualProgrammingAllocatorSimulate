import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/Setup.vue'),
  },
  {
    path: '/simulate',
    name: 'Simulate',
    component: () => import(/* webpackChunkName: "simulate" */ '../views/Simulate.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
