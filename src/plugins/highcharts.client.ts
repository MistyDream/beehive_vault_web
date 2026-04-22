import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import HighchartsVue from 'highcharts-vue';

export default defineNuxtPlugin((nuxtApp) => {
  Highcharts.setOptions({
    lang: {
      decimalPoint: ',',
      thousandsSep: ' ',
    },
    credits: { enabled: false },
    accessibility: { enabled: false },
  });
  nuxtApp.vueApp.use(HighchartsVue);
});
