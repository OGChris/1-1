<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center mt-5 mb-5">
		<main id="wows" role="main" class="inner cover">
			<b-card title="Wows" sub-title="I'm so proud of..." header-text-variant="primary" class="mb-2">
				<b-row v-for="(wow, index) in wows" class="mb-2" :key="wow.id || index">
					<!--<b-col cols="2">
						{{(Number(index) + 1)}}.
					</b-col>-->
					<b-col>
						<b-textarea v-model="wow.text" @input="debouncedUpdate(wow)" :placeholder="`WoW ${index+1}`"
						            :rows="1" :max-rows="6" v-validate.initial="'max:100'" :data-vv-name="`wow${index}`"
									:state="errors.has(`wow${index}`)?'invalid':''" v-autosize="wow.text"></b-textarea>
					</b-col>
				</b-row>

				<div slot="footer">
					<b-row class="justify-content-md-center">
						<b-col cols="6" class="text-left">
							<!--<b-btn variant="primary" @click.prevent="addWow">Add a WoW</b-btn>-->
						</b-col>
						<b-col cols="6" class="text-right">
							<b-btn :disabled="errors.any()" to="Objectives" variant="success">Next</b-btn>
						</b-col>
					</b-row>
				</div>
			</b-card>
		</main>
	</div>
</template>
<style></style>
<script type="text/javascript">
  import _ from 'underscore';
  import { mapState } from 'vuex';

  export default {
    name: 'Wows',
    data() {
      return {
        wows: [],
      };
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
      wows(val) {
        this.$root.collection.wows = val;
      },
    },
    methods: {
      addWow() {
        const obj = {
          // report: this.currentReport.ref.path,
          report: this.currentReport.id,
          text: '',
        };
        this.$root.fbDatabase.collection('wows').add(obj)
          .then((docRef) => { this.wows.push(_.extend({ id: docRef.id }, obj)); })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      },
      // eslint-disable-next-line prefer-arrow-callback,func-names
      debouncedUpdate: _.debounce(function (wow) {
        const item = _.extend({}, wow);
        delete item.id;
        this.$root.fbDatabase.collection('wows').doc(wow.id).update(item)
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      }, 250),
      loadCurrentData() {
        this.$root.$firestore.wows = this.$root.fbDatabase.collection('wows')
          .where('report', '==', this.currentReport.id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addWow();
              this.addWow();
            } else {
              querySnapshot.forEach((doc) => {
                this.wows.push(_.extend({ id: doc.id }, doc.data()));
              });
            }
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
    },
    mounted() {
      if (this.currentReport) {
        this.loadCurrentData();
      }
    },
  };
</script>
