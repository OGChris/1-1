<template>
	<div>
		<b-row>
			<b-col class="mt-2">
				<b-form-group horizontal label="Filter" :label-cols="2">
					<b-input-group>
						<b-input v-model="filters.search" placeholder="Type to Search" />
						<b-select v-model="filters.status" :options="statusOptions"></b-select>
						<b-select v-model="filters.who" :options="whoOptions"></b-select>
						<b-input-group-button>
							<b-btn @click="filters = {search: null, status: null, who: null}">Clear</b-btn>
						</b-input-group-button>
					</b-input-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table v-if="status_reports.length" responsive head-variant="dark" bordered hover :items="status_reports"
				         :fields="['item', 'stage', 'status', 'next_steps', 'who', 'date']" :busy.sync="isBusy" :filter="filter" show-empty >
					<template slot="stage" slot-scope="data">
						{{ getStageObject(data.value).name }}
					</template>
					<template slot="next_steps" slot-scope="data">
						<b-table small striped outlined show-empty head-variant="dark" :items="data.value" :fields="stepsFields">
							<template slot="text" slot-scope="data">
								<div class="text-left">{{ data.value }}</div>
							</template>
							<template slot="who" slot-scope="data">
								<b-badge class="mr-1" variant="primary" v-for="item in data.value" v-text="item"></b-badge>
							</template>
							<template slot="due_date" slot-scope="data">
								<template v-if="data.value">{{ data.value | mFormat('ll') }}</template>
							</template>
						</b-table>
					</template>
					<template slot="date" slot-scope="data">
						<template v-if="data.value">{{ data.value | mFormat('MMM DD') }}</template>
					</template>
				</b-table>
			</b-col>
		</b-row>
	</div>
</template>
<style>
	.table td {
		vertical-align: middle;
	}
</style>
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
        isBusy: false,
        filters: {
          search: null,
          status: null,
          who: null,
        },
        fields: [
          { key: 'text', sortable: false },
          { key: 'media', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
        ],
        stepsFields: [
          { key: 'text', sortable: false },
          { key: 'who', sortable: false },
          { key: 'due_date', sortable: true },
        ],
        stageOptions: [
          { name: 'Initiate', code: 'I', value: '1' },
          { name: 'Define', code: 'D1', value: '2' },
          { name: 'Design', code: 'D2', value: '3' },
          { name: 'Develop', code: 'D3', value: '4' },
          { name: 'Deliver', code: 'D4', value: '5' },
          { name: 'Close', code: 'C', value: '6' },
        ],
        statusOptions: [{ value: null, text: 'Filter by Status' }, 'Planned', 'In Progress', 'On Hold', 'Complete'],
        whoOptions: [{ value: null, text: 'Filter by Who' }, 'JR', 'KP', 'OT', 'GD', 'AK', 'NL', 'YE', 'EW', 'KF', 'TL', 'LS', 'HV', 'KR'],
      };
    },
    methods: {
      filter(data) {
        let test = true;
        if (this.filters.who) {
          if (data.who === this.filters.who) {
            test = true;
          } else return false;
        }
        if (this.filters.status) {
          if (data.status === this.filters.status) {
            test = true;
          } else return false;
        }
        if (this.filters.search) {
          test = _.some(data, this.recursiveObjectFilterSearch);
        }
        return test;
      },
      recursiveObjectFilterSearch(item) {
        // eslint-disable-next-line no-nested-ternary
        return _.isObject(item) || _.isArray(item)
          ? _.some(item, this.recursiveObjectFilterSearch)
          : item ? item.toLowerCase().includes(this.filters.search.toLowerCase()) : false;
      },
      getStageObject(val) {
        return val ? _.findWhere(this.stageOptions, { value: val }) : '';
      },
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('status_reports')
          .where('item', '>', '') // filter out empty status_reports
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
