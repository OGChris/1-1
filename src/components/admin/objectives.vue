<template>
	<div>
		<b-row>
			<b-col></b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table v-if="!loading" striped hover responsive :items="objectives" :fields="fields">
					<template slot="completed" slot-scope="data">
						<template v-if="completed"><i class="fa fa-check-square-o text-success"></i> <small>{{ completed_at|mFormat('YYYY-[W]ww') }}</small></template>
						<template v-else><i class="fa fa-close text-secondary"></i></template>
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

  export default {
    name: 'objectives',
    data() {
      return {
        loading: true,
        objectives: [],
        reports: [],
        fields: [
          { key: 'text', label: 'Objective', sortable: false },
          { key: 'completed', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
        ],
      };
    },
    methods: {
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('objectives')
          .where('text', '>', '') // filter out empty objectives
          .limit(25)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // loop through objectives
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  const item = doc.data();
                  this.objectives.push(_.extend({ id: doc.id }, item));
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
                // Loop through objectives adding report data
                for (let i = 0; i < this.objectives.length; i++) {
                  const report = _.findWhere(this.reports, { id: this.objectives[i].report });
                  this.objectives[i].user = report.uid;
                  this.objectives[i].week_of = report.week_of;
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