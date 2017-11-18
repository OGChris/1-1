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

// Admin Components
import AdminWrapper from '@/components/admin/wrapper';
import AdminDashboard from '@/components/admin/dashboard';
import AdminWows from '@/components/admin/wows';
import AdminObjectives from '@/components/admin/objectives';
import AdminOpportunities from '@/components/admin/opportunities';
import AdminStatusReports from '@/components/admin/status-reports';

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
      path: '/admin',
      component: AdminWrapper,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: AdminDashboard,
        },
        {
          path: 'wows',
          name: 'WOWs',
          component: AdminWows,
        },
        {
          path: 'objectives',
          name: 'Objectives',
          component: AdminObjectives,
        },
        {
          path: 'opportunities',
          name: 'Opportunities',
          component: AdminOpportunities,
        },
        {
          path: 'status-reports',
          name: 'Status Reports',
          component: AdminStatusReports,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
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
  // requiresAdmin
  if (requiresAuth && !currentUser) next('/');
  else if (!requiresAuth && currentUser) next();
  else next();
});
export default router;
