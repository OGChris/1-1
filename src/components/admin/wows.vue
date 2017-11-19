<template>
	<div>
		<b-row>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col class="text-left">
				<b-table v-if="!loading" striped hover responsive :items="wows" :fields="fields">
					<template slot="user" slot-scope="data">
						<div v-html="getUserFromList(data.value)"></div>
					</template>
				</b-table>
			</b-col>
		</b-row>
	</div>
</template>
<style></style>
<script type="text/javascript">
  /* eslint-disable no-param-reassign,no-plusplus */
  import _ from 'underscore';
  import AdminFunctions from './admin-functions.mixin';

  export default {
    name: 'wows',
    mixins: [AdminFunctions],
    data() {
      return {
        loading: true,
        wows: [],
        reports: [],
        fields: [
          { key: 'text', sortable: false },
          { key: 'media', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
        ],
      };
    },
    methods: {
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('wows')
          .where('text', '>', '') // filter out empty wows
          .limit(25)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // loop through wows
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  const wow = doc.data();
                  this.wows.push(_.extend({ id: doc.id }, wow));
                  // collect report ids
                  reportIDs.push(wow.report);
                }
              });
              // purge array of duplicates
              reportIDs = _.uniq(reportIDs);
              // grab reports
              const promises = [];
              for (let i = 0; i < reportIDs.length; i++) {
                promises.push(this.getReportData(reportIDs[i]).then((doc) => {
                  const report = doc.data();
                  this.reports.push(_.extend({ id: doc.id }, report));
                }));
              }

              Promise.all(promises).then(() => {
                // Loop through wows adding report data
                for (let i = 0; i < this.wows.length; i++) {
                  const report = _.findWhere(this.reports, { id: this.wows[i].report });
                  this.wows[i].user = report.uid;
                  this.wows[i].week_of = report.week_of;
                }

                // Reports Loaded
                this.loading = false;
              });
            }
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
    },
    mounted() {
      this.loadData();
    },
  };
</script>
