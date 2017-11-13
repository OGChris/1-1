/* eslint-disable no-unused-vars,no-undef */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import 'underscore';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.min.css';

import * as clouds from '@/assets/clouds.jpg';
import * as fall from '@/assets/fall.jpg';
import * as bokeh from '@/assets/light-bokeh.jpg';
import * as wood from '@/assets/wood.jpg';

import Vue from 'vue';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
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

Vue.component('shared-header', header);

Vue.filter('mFormat', (value, format) => moment(value).format(format));

// Vue.component('date-picker', datePicker);
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
          collection: {
            weekOf: null,
            wows: [],
            objectives: [],
            opportunities: [],
            notes: [],
            statusReports: [],
          },
          backgrounds: { fall, bokeh, clouds, wood },
        };
      },
      mounted() {
        // this.user = this.fbAuth.currentUser;
        if (localStorage.SelectedBackground) {
          $('html').css('background-image', `url("${this.$root.backgrounds[localStorage.SelectedBackground || 'fall']}")`);
        }
      },
    });
  } else {
    // debugger;
  }
});
