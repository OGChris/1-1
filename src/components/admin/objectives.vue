<template>
	<div>
		<b-row>
			<b-col class="mt-2">
				<b-form-group horizontal label="Filter" :label-cols="2">
					<b-input-group>
						<b-input v-model="filters.search" placeholder="Type to Search" />
						<!--<b-select v-model="filters.status" :options="statusOptions"></b-select>-->
						<b-select v-model="filters.user" :options="usersList" value-field="id" text-field="displayName"></b-select>
						<b-input-group-button>
							<b-btn @click="resetFilters">Clear</b-btn>
						</b-input-group-button>
					</b-input-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col class="text-left">
				<b-table v-if="!loading" striped hover responsive="sm" :items="objectives" :fields="fields" :filter="filter">
					<template slot="HEAD_completed">
						<i v-b-tooltip.hover title="Completed" class="fa fa-check-square-o text-success"></i>
					</template>
					<template slot="week_of" slot-scope="data">{{data.value|mWeekToRange}}</template>
					<template slot="completed" slot-scope="data">
						<template v-if="data.value"><i class="fa fa-check-square-o text-success"></i> <small>{{ data.item.completed_at|mFormat('YYYY-[W]ww') }}</small></template>
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
    name: 'objectives',
    mixins: [AdminFunctions],
    data() {
      return {
        loading: true,
        objectives: [],
        reports: [],
        fields: [
          // { key: 'id', sortable: false },
          { key: 'text', label: 'Objective', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
          { key: 'completed', sortable: false },
        ],
      };
    },
    methods: {
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('objectives')
          // .where('text', '>', '') // filter out empty objectives
          // .limit(25)
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
                const batch = this.$root.fbDatabase.batch();
                let batchCount = 0;
                for (let i = 0; i < this.objectives.length; i++) {
                  const report = _.findWhere(this.reports, { id: this.objectives[i].report });
                  this.objectives[i].user = report.uid;
                  if (!this.objectives[i].week_of && this.objectives[i].id) {
                    batchCount++;
                    this.objectives[i].week_of = report.week_of;
                    const thisRef = this.$root.fbDatabase.collection('objectives').doc(this.objectives[i].id);
                    batch.set(thisRef, { week_of: report.week_of }, { merge: true });
                  }
                }
                if (batchCount) batch.commit();

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
