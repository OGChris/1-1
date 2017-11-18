/* eslint-disable no-confusing-arrow */
import _ from 'underscore';

export default {
  data() {
    return {
      usersList: [],
    };
    // this.hello();
  },
  methods: {
    getReportData(id) {
      return this.$root.fbDatabase.collection('reports').doc(id).get().then(doc => doc.exists ? doc : false);
    },
    getUserData(uid) {
      return this.$root.fbDatabase.collection('users').doc(uid).get().then(doc => doc.exists ? doc : false);
    },
    getAllUserData() {
      return this.$root.fbDatabase.collection('users').get().then((list) => {
        list.forEach((user) => {
          this.usersList.push(_.extend({ id: user.id }, user.data()));
        });
      });
    },
  },
  created() {
    this.getAllUserData();
  },
};
