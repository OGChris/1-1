<template>
	<div>
		<b-row>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col class="text-left">
				<b-table v-if="!loading" striped hover responsive :items="opportunities" :fields="fields">
					<template slot="HEAD_completed">
						<i v-b-tooltip.hover title="Completed" class="fa fa-check-square-o text-success"></i>
					</template>
					<template slot="completed" slot-scope="data">
						<template v-if="completed"><i class="fa fa-check-square-o text-success"></i> <small>{{ completed_at|mFormat('YYYY-[W]ww') }}</small></template>
						<template v-else><i class="fa fa-close text-secondary"></i></template>
					</template>
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
    name: 'opportunities',
    mixins: [AdminFunctions],
    data() {
      return {
        loading: true,
        opportunities: [],
        reports: [],
        fields: [
          { key: 'text', label: 'Opportunity', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
        ],
      };
    },
    methods: {
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('opportunities')
          .where('text', '>', '') // filter out empty opportunities
          .limit(25)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // loop through opportunities
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  const item = doc.data();
                  this.opportunities.push(_.extend({ id: doc.id }, item));
                  // collect report ids
                  reportIDs.push(item.report);
                }
              });
              // purge array of duplicates
              reportIDs = _.uniq(reportIDs);
              // grab reports
              const promises = [];
              for (let i = 0; i < reportIDs.length; i++) {
                promises.push(this.$root.fbDatabase.collection('reports').doc(reportIDs[i]).get().then((doc) => {
                  if (doc.exists) {
                    const report = doc.data();
                    this.reports.push(_.extend({ id: doc.id }, report));
                  }
                }));
              }
              Promise.all(promises).then(() => {
                // Loop through opportunities adding report data
                for (let i = 0; i < this.opportunities.length; i++) {
                  const report = _.findWhere(this.reports, { id: this.opportunities[i].report });
                  this.opportunities[i].user = report.uid;
                  this.opportunities[i].week_of = report.week_of;
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
