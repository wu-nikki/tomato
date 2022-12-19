<template lang="pug">
v-app
  v-app-bar(color="indigoDarken")
    v-app-bar-title 蕃茄鐘
    v-spacer
    v-btn(icon="mdi-alarm" variant="text" to="/")
    v-btn(icon="mdi-account-details" variant="text" to="/list")
    v-btn(icon="mdi-cog" variant="text" to="/settings")
    v-btn(:icon="notify ? 'mdi-bell' : 'mdi-bell-off'" variant="text" @click="toggleNotify")
  v-main
    v-container
      router-view(v-slot="{ Component }")
        //- 換頁保留元件不被銷毀
        //- 設定include指定要保留的元件
        keep-alive(include="HomeView")
          //- 動態元件，將元件以 is 傳入
          component(:is="Component")
</template>

<script setup>
import { useSettingsStore } from './stores/settings'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { notify } = storeToRefs(settings)
const { toggleNotify } = settings
</script>
