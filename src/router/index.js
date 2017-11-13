/* eslint-disable prefer-const */
import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Auth from '@/components/auth';

// Forms
import ReportWrapper from '@/components/reports/wrapper';
import Wows from '@/components/reports/Wows';
import Objectives from '@/components/reports/Objectives';
import Opportunities from '@/components/reports/Opportunities';
import StatusReports from '@/components/reports/StatusReports';
import Review from '@/components/reports/Review';

Vue.use(Router);
// eslint-disable-next-line import/no-mutable-exports,prefer-const
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/reports/:week',
      component: ReportWrapper,
      props: true,
      children: [
        {
          path: 'wows',
          name: 'WoWs',
          component: Wows,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'objectives',
          name: 'Objectives',
          component: Objectives,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'opportunities',
          name: 'Opportunities',
          component: Opportunities,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'status-reports',
          name: 'Status Reports',
          component: StatusReports,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'review',
          name: 'Review',
          component: Review,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: '/auth',
      name: 'Authentication',
      component: Auth,
    },
  ],
});

router.beforeEach((to, from, next) => {
  let currentUser = window.firebaseApp.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('/');
  else if (!requiresAuth && currentUser) next();
  else next();
});
export default router;
