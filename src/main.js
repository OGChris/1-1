/* eslint-disable no-unused-vars,no-undef */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import 'underscore';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.min.css';
import 'fullpage.js/dist/jquery.fullpage.min.css';

import Vue from 'vue';
import vSelect from 'vue-select';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import Datepicker from 'vuejs-datepicker';
import VueLocalForage from 'vue-localforage';
import VueAutosize from 'vue-autosize';
import $ from 'jquery';
import moment from 'moment';
import store from './store';
import App from './App';
import sharedHeader from './components/shared/header';
import router from './router';
import Janneke from './assets/avatar/Janneke.png';

// Required for side-effects
window.jQuery = $;
window.$ = $;
require('firebase/firestore');
window.IScroll = require('iscroll');
require('fullpage.js/vendors/scrolloverflow.min');
require('fullpage.js');

Vue.use(VueLocalForage);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(VueAutosize);

Vue.component('v-select', vSelect);
Vue.component('shared-header', sharedHeader);
Vue.component('datepicker', Datepicker);

Vue.filter('mFormat', (value, format) => moment(value).format(format));
Vue.filter('mWeekToRange', (value) => {
  if (!value || value === 'Invalid date') return '';
  const m = moment.isMoment(value) ? value : moment(value, 'YYYY-[W]ww');
  const start = m.startOf('w').day('Monday').format('MMM DD');
  // if end falls on a different month than start we must include the month name
  const end = moment(m.startOf('w').day('Monday')).isSame(m.endOf('w').day('Friday'), 'month') ? m.endOf('w').day('Friday').format('DD') : m.endOf('w').day('Friday').format('MMM DD');
  return `${start} - ${end}`;
});

Vue.config.productionTip = false;

const ogApp = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data() {
    return {
      defaultAvatar: Janneke,
      user: null,
      isAdmin: false,
      collection: {
        weekOf: null,
        wows: [],
        objectives: [],
        opportunities: [],
      },
    };
  },
  watch: {
    collection: {
      deep: true,
      handler(val) {
        if ($.fn.fullpage && $.fn.fullpage.reBuild) $.fn.fullpage.reBuild();
        this.$setItem(val.weekOf, val);
      },
    },
  },
  mounted() {
    this.$storageConfig({
      // driver: localforage.LOCALSTORAGE,
      name: 'orangegate',
      storeName: 'og1_1',
    });
    this.$getItem('auth', (error, data) => {
      if (data) {
        this.$store.commit('setUser', data);
      }
    });
  },
});
