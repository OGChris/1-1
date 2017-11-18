<template>
	<div>
		<b-row>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table responsive v-if="status_reports.length" head-variant="dark" striped hover :items="status_reports"
				         :fields="['item', 'stage', 'status', 'next_steps', 'who', 'date']">
					<template slot="stage" slot-scope="data">
						{{ getStageObject(data.value).name }}
					</template>
					<template slot="next_steps" slot-scope="data">
						<ol>
							<li v-for="(step, index) in data.value" v-text="step.text"></li>
						</ol>
					</template>
					<template slot="date" slot-scope="data">
						<template v-if="data.value">{{ data.value | mFormat('MMM DD') }}</template>
					</template>
				</b-table>			</b-col>
		</b-row>
	</div>
</template>
<style></style>
<script type="text/javascript">
  /* eslint-disable no-param-reassign,no-plusplus */
  import _ from 'underscore';
  import AdminFunctions from './admin-functions.mixin';

  export default {
    name: 'status-reports',
    mixins: [AdminFunctions],
    data() {
      return {
        loading: true,
        status_reports: [],
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
        this.$root.fbDatabase.collection('status_reports')
          .where('text', '>', '') // filter out empty status_reports
          .limit(25)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // loop through status_reports
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  const wow = doc.data();
                  this.status_reports.push(_.extend({ id: doc.id }, wow));
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
                // Loop through status_reports adding report data
                for (let i = 0; i < this.status_reports.length; i++) {
                  const report = _.findWhere(this.reports, { id: this.status_reports[i].report });
                  this.status_reports[i].user = report.uid;
                  this.status_reports[i].week_of = report.week_of;
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
