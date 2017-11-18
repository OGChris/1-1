<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center mt-5 mb-5">
		<main id="wows" role="main" class="inner cover">
			<b-card title="WOWs" sub-title="I'm proud of..." header-text-variant="primary" class="mb-2">
				<b-input-group v-for="(wow, index) in wows" class="mb-2" :key="wow.id || index">
					<b-input-group-addon>
						{{index+1}}.
					</b-input-group-addon>
					<b-textarea v-model="wow.text" @input="debouncedUpdate(wow)" :placeholder="`WOW ${index+1}`" style="min-height: 38px;"
					            :rows="1" :max-rows="6" v-validate.initial="'max:100'" :data-vv-name="`wow${index}`"
					            :state="errors.has(`wow${index}`)?'invalid':''" v-autosize="wow.text"></b-textarea>
				</b-input-group>
				<b-btn block variant="outline-secondary" @click.prevent="addWow"><i class="fa fa-plus"></i> Add WOW</b-btn>

				<div slot="footer">
					<b-row class="justify-content-md-center">
						<b-col cols="6" class="text-left">

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
          uid: this.user.uid,
          report: this.currentReport.id,
          text: '',
          media: '',
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
