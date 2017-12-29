<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center" style="padding-top: 4rem;">
		<main role="main" class="inner cover">
			<b-card class="mb-2">
				<h4 class="card-title" style="color: #3c4488">Review of 1:1</h4>
				<h6 class="card-subtitle">{{ weekMoment| mWeekToRange }}, {{ weekMoment.endOf('w').format('YYYY') }}</h6>
				<b-card-body class="text-left">
					<h5>WoWs
						<b-btn class="float-right review-edit-btn" size="sm" variant="outline-secondary" :to="`/reports/${$root.collection.weekOf}#WOWs`"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h5>
					<ol v-if="$root.collection.wows.length">
						<li v-for="(wow, index) in $root.collection.wows" v-text="wow.text"></li>
					</ol>
					<p v-else>None Set</p>
					<hr>

					<h5>Serendipity
						<b-btn class="float-right review-edit-btn" size="sm" variant="outline-secondary" :to="`/reports/${$root.collection.weekOf}#Serendipity`"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h5>
					<ol v-if="$root.collection.opportunities.length">
						<li v-for="(opp, index) in $root.collection.opportunities" v-text="opp.text"></li>
					</ol>
					<p v-else>None Set</p>
					<hr>

					<h5>Priorities
						<b-btn class="float-right review-edit-btn" size="sm" variant="outline-secondary" :to="`/reports/${$root.collection.weekOf}#Priorities`"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h5>
					<ol v-if="$root.collection.objectives.length">
						<li v-for="(obj, index) in $root.collection.objectives">{{obj.text}} <b-badge variant="info">{{ obj.bandwidth }} {{ obj.bandwidth_unit }}</b-badge></li>
					</ol>
					<p v-else>None Set</p>
				</b-card-body>
				<div slot="footer">
					<b-row>
						<b-col class="text-right">
							<b-button-group>
								<b-dropdown variant="info" right text="Export 1:1">
									<!--<b-dropdown-item @click="exportAs('xml')">XML</b-dropdown-item>-->
									<!--<b-dropdown-item @click="exportAs('json')">JSON</b-dropdown-item>-->
									<b-dropdown-header>CSV</b-dropdown-header>
									<b-dropdown-item @click="exportAs('csv', 'wows')">WOWs Only</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'opportunities')">Serendipity Only</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'objectives')">Priorities Only</b-dropdown-item>
									<b-dropdown-divider></b-dropdown-divider>
									<b-dropdown-item @click="exportAs('print')">Print</b-dropdown-item>
								</b-dropdown>
								<b-btn variant="outline-info" to="Home">Restart</b-btn>
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
</style>
<script type="text/javascript">
  /* eslint-disable no-case-declarations */

  import swal from 'sweetalert';
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
        weekMoment: moment(localStorage.SelectedWeek, 'YYYY-[W]ww'),
        moment,
      };
    },
    computed: mapState(['user', 'week']),
    methods: {
      exportAs(type, spec) {
        let blob;
        const blobs = {};
        const weekMoment = moment(this.week, 'YYYY-[W]ww');
        // build js object
        const object = {
          report: {
            uid: this.user.uid,
            name: `${this.user.displayName} ${this.week}`,
            week_of: this.week,
            date_range: `${weekMoment.startOf('w').format('YYYY-MM-DD')} - ${weekMoment.endOf('w').format('YYYY-MM-DD')}`,
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
            FileSaver.saveAs(blob, `${this.user.displayName} ${object.report.week_of}.xml`);
            break;
          case 'json':
            blob = new Blob([JSON.stringify(object)], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(blob, `${this.user.displayName} ${object.report.week_of}.json`);
            break;
            // eslint-disable-next-line no-case-declarations
          case 'csv':
            try {
              switch (spec) {
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
          if (!error) {
            this.$root.collection = data;
          } else {
            this.$root.collection.weekOf = this.$route.params.week;
          }
        });
      }
    },
  };
</script>
