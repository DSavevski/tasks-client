// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VCalendar from 'v-calendar';

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VDivider,
  VSubheader,
  VTooltip,
  VDialog,
  VCard,
  VSelect,
  VTextField,
  VTabs,
  transitions
} from 'vuetify'

import '../node_modules/vuetify/src/stylus/app.styl'
import 'v-calendar/lib/v-calendar.min.css';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VDivider,
    VSubheader,
    VTooltip,
    VDialog,
    VCard,
    VSelect,
    VTextField,
    VTabs,
    transitions
  }
})

Vue.use(VCalendar, {
  firstDayOfWeek: 2, // Set first day of week to Sunday
  popoverExpanded: true,
  /*popoverVisibility: 'visible',*/
  datePickerInputClass: 'datepicker-input',
  datePickerInputPlaceholder: 'FSADASDDA'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
