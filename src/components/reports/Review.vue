<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center review-container">
		<main role="main" class="inner cover">
			<b-card class="mb-2">
				<b-row>
					<b-col cols="8" class="text-left">
						<b-media no-body>
							<b-media-aside vertical-align="center">
								<b-img :src="user && user.photoURL ? user.photoURL : $root.defaultAvatar" height="70" center rounded="circle" alt="Avatar" />
							</b-media-aside>
							<b-media-body class="ml-3">
								<h2 class="font-weight-light mt-3 ml-2" style="color: #3c4488">1:1 Update</h2>
							</b-media-body>
						</b-media>
					</b-col>
					<b-col cols="4" class="text-right">
						<h6 class="font-weight-bold" v-if="user">{{ user.displayName }}</h6>
						<h6 class="font-weight-light">{{ weekMoment| mWeekToRange }}, {{ weekMoment.endOf('w').format('YYYY') }}</h6>

					</b-col>
				</b-row>
				<b-card-body class="text-left mt-3">
					<section class="review-section wows-section">
						<h5 class="text-primary">WOWs
							<b-btn class="float-right review-edit-btn text-secondary" size="sm" variant="link" :to="`/reports/${$root.collection.weekOf}#WOWs`"><i
									class="fa fa-edit"></i>
							</b-btn>
						</h5>
						<ol v-if="$root.collection.wows.length">
							<li v-for="(wow, index) in $root.collection.wows" v-text="wow.text"></li>
						</ol>
						<p v-else>None Set</p>
						<hr class="mt-4 mb-2">
					</section>
					<section class="review-section serendipity-section">
						<h5 class="text-primary">Serendipity
							<b-btn class="float-right review-edit-btn text-secondary" size="sm" variant="link" :to="`/reports/${$root.collection.weekOf}#Serendipity`"><i
									class="fa fa-edit"></i>
							</b-btn>
						</h5>
						<ol v-if="$root.collection.opportunities.length">
							<li v-for="(opp, index) in $root.collection.opportunities" v-text="opp.text"></li>
						</ol>
						<p v-else>None Set</p>
						<hr class="mt-4 mb-2">
					</section>
					<section class="review-section priorities-section">
						<h5 class="text-primary">Priorities
							<b-btn class="float-right review-edit-btn text-secondary" size="sm" variant="link" :to="`/reports/${$root.collection.weekOf}#Priorities`"><i
									class="fa fa-edit"></i>
							</b-btn>
						</h5>
						<ol v-if="$root.collection.objectives.length">
							<li v-for="(obj, index) in $root.collection.objectives">{{obj.text}} <b-badge variant="info" v-if="obj.text">{{ obj.bandwidth }} {{ obj.bandwidth_unit }}</b-badge></li>
						</ol>
						<p v-else>None Set</p>
					</section>
				</b-card-body>
				<div slot="footer">
					<b-row>
						<b-col class="text-right">
							<b-button-group>
								<b-btn variant="outline-secondary" @click="exportAs('print')">Print</b-btn>
								<b-dropdown variant="outline-secondary" right text="Export 1:1">
									<!--<b-dropdown-item @click="exportAs('xml')">XML</b-dropdown-item>-->
									<!--<b-dropdown-item @click="exportAs('json')">JSON</b-dropdown-item>-->
									<b-dropdown-header>CSV</b-dropdown-header>
									<b-dropdown-item @click="exportAs('csv', 'all')">All</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'wows')">WOWs Only</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'opportunities')">Serendipity Only</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'objectives')">Priorities Only</b-dropdown-item>
								</b-dropdown>
								<b-btn variant="secondary" to="Home">Restart</b-btn>
							</b-button-group>
						</b-col>
					</b-row>
				</div>
			</b-card>
		</main>
	</div>
</template>
<style scoped>
	.inner h4, .inner h6 { font-weight: 300; color: #333333 !important; }
	.inner h4 {
		color: #3c4488 !important;
		font-size: 3rem;
	}

	.review-container {
		padding-top: 7rem;
	}

	@media print {
		.review-container {
			padding-top: 0;
		}
	}
</style>
<script type="text/javascript">
  /* eslint-disable no-case-declarations,no-param-reassign,no-unreachable */

  import swal from 'sweetalert';
  import _ from 'underscore';
  import moment from 'moment';
  import FileSaver from 'file-saver';
  import ToCSV from 'json2csv';
  import converter from 'xml-js';
  import { mapState } from 'vuex';

  // import user backgrounds
  // import AndreaBG from './assets/bg/Andrea_bg image.png';
  // import EthanBG from './assets/bg/Ethan_bg image.png';
  // import GinnyBG from './assets/bg/Ginny_bg image.png';
  // import HarpreetBG from './assets/bg/Harpreet_bg image.png';
  // import JannekeBG from './assets/bg/Janneke_bg image.png';
  // import KeerththanaBG from './assets/bg/Keerththana_bg image.png';
  // import KeyanBG from './assets/bg/Keyan_bg image.png';
  // import KriskaBG from './assets/bg/Kriska_bg image.png';
  // import LeeBG from './assets/bg/Lee_bg image.png';
  // import NayeonBG from './assets/bg/Nayeon_bg image.png';
  // import OzgeBG from './assets/bg/Ozge_bg image.png';
  // import TomBG from './assets/bg/Tom_bg image.png';
  // import YsabelBG from './assets/bg/Ysabel_bg image.png';


  export default {
    name: 'Review',
    data() {
      return {
        _,
        weekMoment: moment(localStorage.SelectedWeek, 'YYYY-[W]ww'),
        moment,
      };
    },
    computed: mapState(['user', 'week']),
    methods: {
      exportAs(type, spec) {
        let blob;
        const blobs = {
          setValueFromRow(row, unit) {
            if (row.data.type === 'Priorities') {
              return row.data.bandwidth_unit === unit ? row.data.bandwidth : null;
            }
            return null;
          },
        };
        const weekMoment = moment(this.$route.params.week, 'YYYY-[W]ww');
        // build js object
        const object = {
          report: {
            // uid: this.user.uid,
            name: this.user.displayName,
            date_created: moment().format('DD-MM-YYYY'),
            week_of: this.$route.params.week,
            week_number: moment(this.$route.params.week, 'YYYY-[W]ww').format('w'),
            week_date_start: weekMoment.startOf('w').format('DD-MM-YYYY'),
            week_date_end: weekMoment.endOf('w').format('DD-MM-YYYY'),
            date_range: `${weekMoment.startOf('w').format('YYYY-MM-DD')} - ${weekMoment.endOf('w').format('YYYY-MM-DD')}`,
            // eslint-disable-next-line max-len
            data: _.union(
              _.each(this.$root.collection.wows, (a) => { a.type = 'WOWs'; }),
              _.each(this.$root.collection.opportunities, (a) => { a.type = 'Serendipity'; }),
              _.each(this.$root.collection.objectives, (a) => { a.type = 'Priorities'; }),
            ),
            wows: this.$root.collection.wows,
            objectives: this.$root.collection.objectives,
            opportunities: this.$root.collection.opportunities,
          },
        };

        switch (type) {
          // eslint-disable-next-line no-case-declarations
          case 'xml':
            const options = {
              spaces: 3,
              compact: true,
              fullTagEmptyElement: true,
              ignoreDeclaration: false,
              ignoreInstruction: false,
              ignoreAttributes: false,
            };
            const xml = `<?xml version="1.0" encoding="utf-8"?>\n${converter.json2xml(JSON.stringify(object), options)}`;
            blob = new Blob([xml], { type: 'text/plain;charset=utf-8' });
            // FileSaver.saveAs(blob, `${this.user.displayName} ${object.report.week_of}.xml`);
            break;
          case 'json':
            blob = new Blob([JSON.stringify(object)], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(blob, `${this.user.displayName} ${object.report.week_of}.json`);
            break;
            // eslint-disable-next-line no-case-declarations
          case 'csv':
            try {
              switch (spec) {
                case 'all':
                  const all = ToCSV({
                    data: object.report,
                    defaultValue: 'null',
                    unwindPath: ['data'],
                    fields: [
                      { label: 'Date Completed', value: 'date_created' },
                      { label: 'Week #', value: 'week_number' },
                      { label: 'Week Date Start', value: 'week_date_start' },
                      { label: 'Week Date End', value: 'week_date_end' },
                      { label: 'Name', value: 'name' },
                      { label: 'Type', value: 'data.type' },
                      { label: 'Text', value: 'data.text' },
                      { label: 'Time (Hours)', value: row => blobs.setValueFromRow(row, 'hours') },
                      { label: 'Time (Days)', value: row => blobs.setValueFromRow(row, 'days') },
                      { label: 'Time (Weeks)', value: row => blobs.setValueFromRow(row, 'weeks') },
                    ],
                  });
                  blobs.all = new Blob([all], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.all, `${this.user.displayName} ${object.report.week_of}.csv`);
                  swal('Export 1:1', 'WOWs Exported', 'success');
                  break;
                case 'wows':
                  const wows = ToCSV({ data: object.report.wows });
                  blobs.wows = new Blob([wows], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.wows, `${this.user.displayName} ${object.report.week_of}: WOWs.csv`);
                  swal('Export 1:1', 'WOWs Exported', 'success');
                  break;
                case 'objectives':
                  const objectives = ToCSV({ data: object.report.objectives });
                  blobs.objectives = new Blob([objectives], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.objectives, `${this.user.displayName} ${object.report.week_of}: Priorities.csv`);
                  swal('Export 1:1', 'Priorities Exported', 'success');
                  break;
                case 'opportunities':
                  const opportunities = ToCSV({ data: object.report.opportunities });
                  blobs.opportunities = new Blob([opportunities], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.opportunities, `${this.user.displayName} ${object.report.week_of}: Serendipity.csv`);
                  swal('Export 1:1', 'Serendipity Exported', 'success');
                  break;
                default:
                  break;
              }
            } catch (err) {
              // Errors are thrown for bad options, or
              // if the data is empty and no fields are provided.
              // Be sure to provide fields if it is possible that your data array will be empty.
              swal('Something went wrong!', err, 'error');
            }
            break;
          case 'print':
            window.print();
            break;
          default:
            break;
        }
      },
    },
    mounted() {
      if (!this.$root.collection.weekOf) {
        this.$getItem(this.$route.params.week, (error, data) => {
          if (data) {
            this.$root.collection = data;
          } else {
            this.$root.collection.weekOf = this.$route.params.week;
          }
        });
      }
    },
  };
</script>
