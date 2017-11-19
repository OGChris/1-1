<template>
	<div class="col-sm-12 align-self-center mt-5 mb-5">
		<main id="status_reports" role="main" class="inner cover">
			<b-card title="Review of 1:1" :sub-title="`${weekMoment.startOf('w').format('MMM DD')} - ${weekMoment.endOf('w').format('MMM DD, YYYY')}`" header-text-variant="primary" class="mb-2">
				<b-card-body class="text-left">
					<h4>WoWs
						<b-btn class="float-right" size="sm" variant="outline-secondary" to="wows"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h4>
					<ol v-if="wows.length">
						<li v-for="(wow, index) in wows" v-text="wow.text"></li>
					</ol>
					<p v-else>None Set</p>
					<hr>
					<h4>Objectives
						<b-btn class="float-right" size="sm" variant="outline-secondary" to="objectives"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h4>
					<ol v-if="objectives.length">
						<li v-for="(obj, index) in objectives">{{obj.text}}
							<!-- <span class="float-right">{{obj.completed?'Completed': 'Not Completed'}}</span>--></li>
					</ol>
					<p v-else>None Set</p>
					<hr>

					<h4>Opportunities
						<b-btn class="float-right" size="sm" variant="outline-secondary" to="opportunities"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h4>
					<ol v-if="opportunities.length">
						<li v-for="(opp, index) in opportunities" v-text="opp.text"></li>
					</ol>
					<p v-else>None Set</p>
					<hr>

					<h4>Status Reports
						<b-btn class="float-right" size="sm" variant="outline-secondary" to="status-reports"><i
								class="fa fa-edit"></i> Edit
						</b-btn>
					</h4>
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
					</b-table>
					<p v-else>None Set</p>
				</b-card-body>
				<div slot="footer">
					<b-row>
						<b-col class="text-right">
							<b-button-group>
								<b-dropdown variant="info" right text="Export 1:1">
									<b-dropdown-item @click="exportAs('xml')">XML</b-dropdown-item>
									<b-dropdown-item @click="exportAs('json')">JSON</b-dropdown-item>
									<b-dropdown-header>CSV</b-dropdown-header>
									<b-dropdown-item @click="exportAs('csv', 'wows')">WOWs</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'objectives')">Objectives</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'opportunities')">Opportunities</b-dropdown-item>
									<b-dropdown-item @click="exportAs('csv', 'status-reports')">Status Reports</b-dropdown-item>
									<b-dropdown-divider></b-dropdown-divider>
									<b-dropdown-item disabled @click="exportAs('print')">Print</b-dropdown-item>
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
<style></style>
<script type="text/javascript">
  /* eslint-disable no-case-declarations */

  import _ from 'underscore';
  import moment from 'moment';
  import FileSaver from 'file-saver';
  import ToCSV from 'json2csv';
  import converter from 'xml-js';
  import { mapState } from 'vuex';

  export default {
    name: 'Review',
    data() {
      return {
        weekMoment: moment(localStorage.SelectedWeek, 'YYYY-[W]ww'),
        wows: [],
        objectives: [],
        opportunities: [],
        status_reports: [],
        stageOptions: [
          { name: 'Initiate', code: 'I', value: '1' },
          { name: 'Define', code: 'D1', value: '2' },
          { name: 'Design', code: 'D2', value: '3' },
          { name: 'Develop', code: 'D3', value: '4' },
          { name: 'Deliver', code: 'D4', value: '5' },
          { name: 'Close', code: 'C', value: '6' },
        ],
        moment,
      };
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
    },
    methods: {
      getStageObject(val) {
        return val ? _.findWhere(this.stageOptions, { value: val }) : '';
      },
      loadCurrentData() {
        // Get Wows
        this.$root.fbDatabase.collection('wows').where('report', '==', this.currentReport.id).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.wows.push(_.extend({ id: doc.id }, doc.data()));
            });
          });
        // Get Objectives
        this.$root.fbDatabase.collection('objectives').where('report', '==', this.currentReport.id).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.objectives.push(_.extend({ id: doc.id }, doc.data()));
            });
          });
        // Get Opportunities
        this.$root.fbDatabase.collection('opportunities').where('report', '==', this.currentReport.id).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.opportunities.push(_.extend({ id: doc.id }, doc.data()));
            });
          });
        // Get Status Reports
        this.$root.fbDatabase.collection('status_reports')
          .where('uid', '==', this.user.uid).where('week_of', '==', this.currentReport.data().week_of)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.status_reports.push(_.extend({ id: doc.id }, doc.data()));
            });
          });
      },
      exportAs(type, spec) {
        let blob;
        const blobs = {};
        const reportObj = _.extend({ id: this.currentReport.id }, this.currentReport.data());
        const weekMoment = moment(reportObj.week_of, 'YYYY-[W]ww');
        // build js object
        const object = {
          report: {
            id: reportObj.id,
            uid: reportObj.uid,
            name: `${this.user.displayName} ${reportObj.week_of}`,
            created_at: reportObj.created_at,
            week_of: reportObj.week_of,
            date_range: `${weekMoment.startOf('w').format('YYYY-MM-DD')} - ${weekMoment.endOf('w').format('YYYY-MM-DD')}`,
            wows: this.wows,
            objectives: this.objectives,
            opportunities: this.opportunities,
            statusReports: this.status_reports,
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
            FileSaver.saveAs(blob, `${this.user.displayName} ${reportObj.week_of}.xml`);
            break;
          case 'json':
            blob = new Blob([JSON.stringify(object)], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(blob, `${this.user.displayName} ${reportObj.week_of}.json`);
            break;
            // eslint-disable-next-line no-case-declarations
          case 'csv':
            try {
              switch (spec) {
                case 'wows':
                  const wows = ToCSV({ data: object.report.wows });
                  blobs.wows = new Blob([wows], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.wows, `${this.user.displayName} ${reportObj.week_of}: WOWs.csv`);
                  break;
                case 'objectives':
                  const objectives = ToCSV({ data: object.report.objectives });
                  blob.objectives = new Blob([objectives], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.objectives, `${this.user.displayName} ${reportObj.week_of}: Objectives.csv`);
                  break;
                case 'opportunities':
                  const opportunities = ToCSV({ data: object.report.opportunities });
                  blobs.opportunities = new Blob([opportunities], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.opportunities, `${this.user.displayName} ${reportObj.week_of}: Opportunities.csv`);
                  break;
                case 'status-reports':
                  const statusReports = ToCSV({ data: object.report.statusReports });
                  blobs.statusReports = new Blob([statusReports], { type: 'text/csv;charset=utf-8' });
                  FileSaver.saveAs(blobs.statusReports, `${this.user.displayName} ${reportObj.week_of}: Status Reports.csv`);
                  break;
                default:
                  break;
              }
            } catch (err) {
              // Errors are thrown for bad options, or
              // if the data is empty and no fields are provided.
              // Be sure to provide fields if it is possible that your data array will be empty.
              console.error(err);
            }
            break;
          default:
            break;
        }
      },
    },
    mounted() {
      if (this.currentReport) {
        this.loadCurrentData();
      }
    },
  };
</script>
