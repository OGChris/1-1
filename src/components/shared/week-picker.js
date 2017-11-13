/* eslint-disable newline-per-chained-call,no-plusplus */
import moment from 'moment';
import $ from 'jquery';

export default {
  template: '<div id="weekpicker"><input :class="cssClasses" :name="name" v-model="displayValue"/></div>',
  props: ['more_classes', 'name', 'attributes', 'value'],
  computed: {
    cssClasses() {
      return `form-control ${this.more_classes}`;
    },
    displayValue() {
      if (this.value === undefined) {
        return this.format(moment());
      }
      return this.format2(this.value);
    },
  },
  methods: {
    format(date) {
      const d = moment(date).add(1, 'd');
      const weekFrom = moment(date).add(1, 'd').startOf('week').add(-1, 'd');
      const weekTil = moment(date).add(1, 'd').startOf('week').add(5, 'd');
      return `${d.format('YYYY-[W]W')} (${weekFrom.format('D/M')}-${weekTil.format('D/M')})`;
    },
    format2(date) {
      const year = Number(date.split('-W')[0]);
      const week = Number(date.split('-W')[1].split(' ')[0]);
      const d = moment().day('Monday').year(year).week(week);

      return this.format(d);
    },
  },
  mounted() {
    if (this.attributes !== undefined) {
      for (let i = this.attributes.length - 1; i >= 0; i--) {
        $(this.$el).find('input').attr(this.attributes[i].name, this.attributes[i].value);
      }
    }

    $(this.$el).find('input').datepicker({
      format: {
        toDisplay(date) {
          const d = moment(date).add(1, 'd');
          const weekFrom = moment(date).add(1, 'd').startOf('week').add(-1, 'd');
          const weekTil = moment(date).add(1, 'd').startOf('week').add(5, 'd');
          return `${d.format('YYYY-[W]W')} (${weekFrom.format('D/M')}-${weekTil.format('D/M')})`;
        },

        toValue(date) {
          const year = Number(date.split('-W')[0]);
          const week = Number(date.split('-W')[1].split(' ')[0]);
          const d = moment().day('Monday').year(year).week(week).startOf('day');
          return d.toDate();
        },
      },
      container: '#weekpicker',
      autoclose: true,
      weekStart: 6,
    });

    $(this.$el).find('input').on('show', () => {
      $('#weekpicker').find('.datepicker table tr').each(() => {
        if ($(this).find('td.day.active').length > 0) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    });
    $(this.$el).find('input').on('keyup', () => {
      $('#weekpicker').find('.datepicker table tr').each(() => {
        if ($(this).find('td.day.active').length > 0) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    });
    $(this.$el).find('input').on('change', () => {
      this.value = $(this.$el).find('input').val();
      this.$emit('input', this.value);
    });
  },
};
