<template>
	<div>
		<b-row>
			<b-col class="mt-2">
				<b-form-group horizontal label="Filter" :label-cols="2">
					<b-input-group>
						<b-input v-model="filters.search" placeholder="Type to Search" />
						<datepicker :format="customFormatter" wrapper-class="form-control" input-class="dp-input" v-model="weekOfObject" :highlighted="highlightedDates" @selected="weekOfSelected"></datepicker>
						<b-select v-model="filters.user" :options="usersList" value-field="id" text-field="displayName"></b-select>
							<b-input-group-button>
								<b-btn @click="resetFilters">Clear</b-btn>
								<b-dropdown variant="info" right text="Export">
									<b-dropdown-item @click="prepExport('csv')">CSV</b-dropdown-item>
								</b-dropdown>
							</b-input-group-button>

					</b-input-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col class="text-left">
				<b-table v-if="!loading" striped hover responsive="sm" :items="wows" :fields="fields" :filter="filter">
					<template slot="user" slot-scope="data">
						<div v-html="getUserFromList(data.value)"></div>
					</template>
					<template slot="week_of" slot-scope="data">{{data.value|mWeekToRange}}</template>
				</b-table>
			</b-col>
		</b-row>
	</div>
</template>
<style>
	.dp-input {
		/*width: 240px;*/
		max-width: 100%;
		min-width: 100%;
		border: none;
	}
</style>
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
          // { key: 'media', sortable: false },
          { key: 'week_of', sortable: true },
          { key: 'user', sortable: false },
        ],
        whoOptions: [{ value: null, text: 'Filter by Who' }, 'JR', 'KP', 'OT', 'GD', 'AK', 'NL', 'YE', 'EW', 'KF', 'TL', 'LS', 'HV', 'KR'],
      };
    },
    methods: {
      loadData() {
        let reportIDs = [];
        this.$root.fbDatabase.collection('wows')
          .where('text', '>', '') // filter out empty wows
          // .limit(25)
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
      prepExport(type) {
        const data = [];
        switch (type) {
          case 'csv':
            _.each(this.wows, (item) => {
              if (this.filter(item)) {
                const wow = _.pick(item, 'text', 'week_of', 'user');
                wow.user = this.getUserFromList(item.user).split('> ')[1];
                data.push(wow);
              }
            });
            this.exportAs('csv', 'wows', data);
            break;
          default:
            break;
        }
      },
    },
    mounted() {
      this.loadData();
    },
  };
</script>
