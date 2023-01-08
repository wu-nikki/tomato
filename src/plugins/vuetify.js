/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          redLighten: '#EF5350',
          redDarken2: '#E53935',
          redDarken: '#B71C1C',
          greenDarken: '#2E7D32',
          white: '#fff'
        }
      }
    }
  }
})
