/* eslint-disable no-unused-vars,no-undef */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import 'underscore';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.min.css';

import * as bg1 from '@/assets/bg1.jpg';
import * as bg2 from '@/assets/bg2.jpg';
import * as bg3 from '@/assets/bg3.jpg';
import * as bg4 from '@/assets/bg4.jpg';

import Vue from 'vue';
import Vuex from 'vuex';
import vSelect from 'vue-select';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import Datepicker from 'vuejs-datepicker';
// import Firebase from 'firebase';
import VueFire from 'vuefire';
import VueFirestore from 'vue-firestore';
import VueAutosize from 'vue-autosize';
import $ from 'jquery';
import moment from 'moment';
import store from './store';
import App from './App';
import header from './components/shared/header';
// import datePicker from './components/shared/date-picker';
import router from './router';
import firebaseConfig from './firebase';

const Firebase = require('firebase');

// Required for side-effects
require('firebase/firestore');

const firebaseApp = Firebase.initializeApp(firebaseConfig);
window.firebaseApp = firebaseApp;
// const db = firebaseApp.database();
const db = firebaseApp.firestore();
const fbAuth = firebaseApp.auth();

let ogApp;
Vue.use(VueFire);
Vue.use(VueFirestore);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(VueAutosize);

Vue.component('v-select', vSelect);
Vue.component('shared-header', header);
Vue.component('datepicker', Datepicker);
// Vue.component('date-picker', datePicker);

Vue.filter('mFormat', (value, format) => moment(value).format(format));
Vue.filter('mWeekToRange', (value) => {
  if (!value) return '';
  const m = moment(value, 'YYYY-[W]ww');
  return `${m.startOf('w').format('MMM DD')} - ${m.endOf('w').format('DD')}`;
});

Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    getServerTimestamp() {
      const fireBase = Firebase;
      return fireBase.firestore.FieldValue.serverTimestamp();
    },
  },
});

fbAuth.onAuthStateChanged(() => {
  if (!ogApp) {
    /* eslint-disable no-new */
    ogApp = new Vue({
      el: '#app',
      // firebase: {
      //   reports: db.ref('reports'),
      // },
      firestore() {
        return {
          reports: db.collection('reports'),
        };
      },
      router,
      store,
      template: '<App/>',
      components: { App },
      data() {
        return {
          // items,
          fbAuth,
          fbDatabase: db,
          user: null,
          isAdmin: false,
          collection: {
            weekOf: null,
            wows: [],
            objectives: [],
            opportunities: [],
            notes: [],
            statusReports: [],
          },
          backgrounds: { bg1, bg2, bg3, bg4 },
        };
      },
      mounted() {
        // this.user = this.fbAuth.currentUser;
        if (localStorage.SelectedBackground) {
          $('html').css('background-image', `url("${this.$root.backgrounds[localStorage.SelectedBackground || 'bg1']}")`);
        }
      },
    });
  } else {
    // debugger;
  }
});
