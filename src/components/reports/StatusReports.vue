<template>
	<div class="col-sm-12 align-self-center mt-5 mb-5">
		<main id="status_reports" role="main" class="inner cover">
			<!-- Header Card -->
			<b-card title="Status Reports" header-text-variant="primary" class="mb-2">
				<div role="tablist">
					<b-card v-for="(sp, index) in status_reports" :key="sp.id || index" no-body class="mb-1">
						<b-card-header header-tag="header" class="p-1" role="tab">
							<b-row>
								<b-col cols="9">
									<b-btn block @click="toggleCollapse(index)" variant="dark">{{ sp.item || `Status Report ${index+1}`}}</b-btn>
								</b-col>
								<b-col cols="3">
									<b-btn-group>
										<b-btn :disabled="!sp.item" variant="primary" @click="loadHistory(sp)">View History</b-btn>
										<b-btn variant="danger" @click="deleteStatusReport(sp)"><i class="fa fa-close"></i></b-btn>
									</b-btn-group>
								</b-col>
							</b-row>
						</b-card-header>
						<b-collapse :id="`accordion${index}`" :visible="showCollapse[index]" accordion="sp-accordion" role="tabpanel">
							<b-card-body>
								<div :data-vv-scope="`rep${index}`">
									<b-row>
										<b-col>
											<b-form-group horizontal label="Name">
												<b-input type="text" id="sp-name" v-model="sp.item" @input="debouncedUpdate(sp)"
												         v-validate.initial="'max:40'" :data-vv-name="`item${index}`":state="errors.has(`item${index}`, `rep${index}`)?'invalid':''"
												         :placeholder="`Status Report Item ${index+1}`" :data-vv-scope="`rep${index}`"></b-input>
											</b-form-group>
											<b-form-group horizontal label="Status">
												<b-select id="sp-name" :options="['Planned', 'In Progress', 'On Hold', 'Complete']" v-model="sp.status" @input="debouncedUpdate(sp)"
												          v-validate="'required|min:1'" :data-vv-name="`status${index}`" :state="errors.has(`status${index}`, `rep${index}`)?'invalid':''"
												          placeholder="Item Status" :data-vv-scope="`rep${index}`"></b-select>
											</b-form-group>
										</b-col>
										<b-col>
											<b-form-group>
												<label for="sp-stage">Stage: <b>{{getStageObject(sp.stage).name}}</b></label>
												<br>
												<b-form-radio-group id="sp-stage"
												                    buttons
												                    button-variant="outline-primary"
												                    @change="debouncedUpdate(sp)"
												                    text-field="code"
												                    v-model="sp.stage"
												                    :options="stageOptions"
												                    v-validate="'required|min:1'"
												                    :data-vv-scope="`rep${index}`"
												                    name="stage"></b-form-radio-group>
											</b-form-group>
										</b-col>
									</b-row>

									<b-form-group>
										<label for="sp-name">Next Steps</label>
										<b-card class="mb-2" v-for="(step, stepIndex) in sp.next_steps" :key="index">
											<b-input-group class="mb-2" :left="`${stepIndex+1}`">
												<b-input type="text" v-model="step.text" @input="debouncedUpdate(sp)" :placeholder="`Step ${stepIndex+1}`"
												         v-validate.initial="'max:60'" :data-vv-scope="`rep${index}`" :data-vv-name="`step${stepIndex}${index}`" :state="errors.has(`step${stepIndex}${index}`, `rep${index}`)?'invalid':''"></b-input>
												<b-input-group-button slot="right">
													<b-btn variant="danger" @click="deleteStep(sp.next_steps, index)"><i class="fa fa-times"></i></b-btn>
												</b-input-group-button>
											</b-input-group>
											<b-row>
												<b-col>
													<b-form-group horizontal label="Who">
														<v-select multiple v-model="step.who" @input="debouncedUpdate(sp)" :options="whoOptions" :data-vv-scope="`rep${index}`" v-validate="'required|min:1'" :data-vv-name="`who${index}`" :state="errors.has(`who${index}`, `rep${index}`)?'invalid':''"></v-select>
													</b-form-group>
												</b-col>
												<b-col>
													<b-form-group horizontal label="Due Date">
														<datepicker wrapper-class="form-control" input-class="dp-input" v-model="step.due_date" @input="debouncedUpdate(sp)" :data-vv-scope="`rep${index}`"
														            v-validate="'required|min:1'" :data-vv-name="`date${index}`" :state="errors.has(`date${index}`, `rep${index}`)?'invalid':''"></datepicker>
														<!--<b-input type="date" v-model="step.due_date" @input="debouncedUpdate(sp)" :data-vv-scope="`rep${index}`"
														         v-validate="'required|min:1'" :data-vv-name="`date${index}`" :state="errors.has(`date${index}`, `rep${index}`)?'invalid':''"></b-input>-->
													</b-form-group>
												</b-col>
											</b-row>
										</b-card>
										<b-btn block variant="outline-secondary" @click="sp.next_steps.push({ text: '' })"><i class="fa fa-plus"></i> Add Step</b-btn>
									</b-form-group>

									<b-row>
										<b-col>
											<b-form-group>
												<label :for="`sp-who-${index}`">Who</label>
												<v-select :id="`sp-who-${index}`" v-model="sp.who" @input="debouncedUpdate(sp)" :options="whoOptions" :data-vv-scope="`rep${index}`" v-validate="'required|min:1'" :data-vv-name="`who${index}`" :state="errors.has(`who${index}`, `rep${index}`)?'invalid':''"></v-select>
											</b-form-group>
										</b-col>
										<b-col>
											<b-form-group>
												<label :for="`sp-due-${index}`">Due Date</label>
												<datepicker :id="`sp-due-${index}`" wrapper-class="form-control" input-class="dp-input" v-model="sp.date" @input="debouncedUpdate(sp)" :data-vv-scope="`rep${index}`"
												            v-validate="'required|min:1'" :data-vv-name="`date${index}`" :state="errors.has(`date${index}`, `rep${index}`)?'invalid':''"></datepicker>
												<!--<b-input :id="`sp-due-${index}`" type="date" v-model="sp.date" @input="debouncedUpdate(sp)" :data-vv-scope="`rep${index}`"
												         v-validate="'required|min:1'" :data-vv-name="`date${index}`" :state="errors.has(`date${index}`, `rep${index}`)?'invalid':''"></b-input>-->
											</b-form-group>
										</b-col>
									</b-row>
								</div>
							</b-card-body>
						</b-collapse>
					</b-card>
					<b-btn block variant="outline-primary" @click="addStatusReport"><i class="fa fa-plus"></i> Add Status Report</b-btn>
				</div>
				<div slot="footer">
					<b-row class="justify-content-md-center">
						<b-col cols="6" class="text-left">
							<!--<b-btn variant="primary" @click.prevent="addOpp">Add Another</b-btn>-->
						</b-col>
						<b-col cols="6" class="text-right">
							<b-btn :disabled="errors.any()" to="Review" variant="success">Review</b-btn>
						</b-col>
					</b-row>
				</div>
			</b-card>
		</main>
	</div>
</template>
<style>
	.dp-input {
		width: 240px;
		max-width: 100%;
		min-width: 100%;
		border: none;
	}
</style>
<script type="text/javascript">
  import moment from 'moment';
  import _ from 'underscore';
  import { mapState } from 'vuex';
  
  export default {
    name: 'StatusReport',
    data() {
      return {
        activeHistory: [],
        weekOfFormat: 'YYYY-[W]ww',
        showCollapse: [],
        status_reports: [],
        previousStatusReports: [],
        stageOptions: [
          { name: 'Initiate', code: 'I', value: '1' },
          { name: 'Define', code: 'D1', value: '2' },
          { name: 'Design', code: 'D2', value: '3' },
          { name: 'Develop', code: 'D3', value: '4' },
          { name: 'Deliver', code: 'D4', value: '5' },
          { name: 'Close', code: 'C', value: '6' },
        ],
        whoOptions: ['JR', 'KP', 'OT', 'GD', 'AK', 'NL', 'YE', 'EW', 'KF', 'TL', 'LS', 'HV', 'KR'],
      };
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
      status_reports(val) {
        this.$root.collection.status_reports = val;
      },
    },
    methods: {
      getStageObject(val) {
        return val ? _.findWhere(this.stageOptions, { value: val }) : '';
      },
      toggleCollapse(index) {
        this.$set(this.showCollapse, index, !this.showCollapse[index]);
      },
      deleteStep(arr, index) {
        arr.splice(index, 1);
      },
      addStatusReport() {
        const obj = {
          // report: this.currentReport.ref.path,
          report: this.currentReport.id,
          item: '',
          stage: null,
          uid: this.user.uid,
          status: null,
          next_steps: [
            { text: '', who: null, due_date: null },
            { text: '', who: null, due_date: null },
            { text: '', who: null, due_date: null },
          ],
          who: null,
          date: null,
          week_of: this.currentReport.data().week_of,
        };
        this.$root.fbDatabase.collection('status_reports').add(obj)
          .then((docRef) => {
            this.status_reports.push(_.extend({ id: docRef.id }, obj));
            this.showCollapse.push(false);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      },
      // eslint-disable-next-line prefer-arrow-callback,func-names
      debouncedUpdate: _.debounce(function (statusReport) {
        const item = _.extend({}, statusReport);
        // update item week_of
        item.week_of = this.currentReport.data().week_of;
        const spCollection = this.$root.fbDatabase.collection('status_reports');
        delete item.id;
        // We will keep track of status reports by saving the current status report to
        // a sub-collection called history. This way, the parent doc can be the current version
        // These will be updated weekly as changes are made. i.e. a new history doc
        // will be created every week holding accumulated changes for that week.
        //
        // First query for original object
        spCollection.doc(statusReport.id).get().then((doc) => {
          const data = doc.data();
          // Get a new write batch
          const batch = this.$root.fbDatabase.batch();
          const itemRef = spCollection.doc(statusReport.id);
          // eslint-disable-next-line max-len
          if (moment(data.week_of, this.weekOfFormat).isBefore(moment(this.currentReport.data().week_of, this.weekOfFormat))) {
            const historyRef = spCollection.doc(statusReport.id).collection('history').doc(data.week_of);
            batch.set(historyRef, data);
            batch.update(itemRef, item);
          } else {
            batch.update(itemRef, item);
          }
          // Commit the batch
          batch.commit().catch((error) => {
            console.log('Synchronization failed: ', error);
          });
          // console.log(doc.data().week_of);
          // console.log(this.currentReport.data().week_of);
        });
        // spCollection.doc(statusReport.id).update(item)
        //  .catch((error) => {
        //    console.log('Synchronization failed: ', error);
        //  });
      }, 250),
      loadCurrentData() {
        this.$root.$firestore.status_reports = this.$root.fbDatabase.collection('status_reports')
          .where('report', '==', this.currentReport.id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addStatusReport();
            } else {
              querySnapshot.forEach((doc) => {
                this.status_reports.push(_.extend({ id: doc.id }, doc.data()));
                this.showCollapse.push(false);
              });
            }
            this.loadPreviousData();
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      loadPreviousData() {
        this.$root.fbDatabase.collection('status_reports')
          .where('uid', '==', this.user.uid)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const sp = doc.data();
                if (this.currentReport.id !== sp.report && sp.status !== 'Complete') {
                  this.status_reports.push(_.extend({ id: doc.id }, sp));
                }
              });
            }
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      loadHistory(sp) {
        this.activeHistory = [];
        this.$root.fbDatabase.collection('status_reports').doc(sp.id).collection('history').get()
          .then((querySnapshot) => {
            this.activeHistory.push(sp);
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const spHistDoc = doc.data();
                this.activeHistory.push(spHistDoc);
              });
            }
            this.activeHistory.reverse();
            this.$root.$emit('HistoryModal:SET', this.activeHistory);
            this.$root.$emit('bv::show::modal', 'historyModal');
          });
      },
      deleteStatusReport(sp) {
        const promises = [];
        const docsIds = [];
        let wait = false;
        // check if it has a history sub-collection first
        this.$root.fbDatabase.collection('status_reports').doc(sp.id).collection('history').get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                wait = true;
                docsIds.push(doc.id);
              });
            }
          });

        docsIds.forEach((id) => {
          promises.push(this.$root.fbDatabase.collection('status_reports').doc(sp.id).collection('history').doc(id)
            .delete());
        });
        // Then delete the document
        if (wait) {
          Promise.all(promises).then(() => {
            this.$root.fbDatabase.collection('status_reports').doc(sp.id).delete().then(() => {
              this.status_reports = _.reject(this.status_reports, statRep => statRep.id === sp.id);
            });
          });
        } else {
          this.$root.fbDatabase.collection('status_reports').doc(sp.id).delete().then(() => {
            this.status_reports = _.reject(this.status_reports, statRep => statRep.id === sp.id);
          });
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
