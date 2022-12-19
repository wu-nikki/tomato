<template lang="pug">
v-row#list
  v-col(cols="12")
    h1 {{ currentText }}
    h2 {{ currentTime }}
  v-col(cols="12")
    v-btn(v-if="status!==1" icon="mdi-play" color="indigoLighten3" variant="flat" @click="startTimer")
    v-btn(v-else icon="mdi-pause" variant="flat" color="indigoLighten3" @click="pauseTimer")
    v-btn(v-if="currentItem.length >0" icon="mdi-skip-next" variant="flat" color="indigoLighten3" @click="finishTimer")

</template>

<script setup>
import { ref, computed } from 'vue'
import { useListStore } from '@/stores/list'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

// onUnmounted 生命週期(顯示切換頁)
// onUnmounted(() => {
//   console.log('Home unmounted')
// })

const list = useListStore()
const { currentItem, items, timeleft } = storeToRefs(list)
const { start, countdown, finish } = list

const settings = useSettingsStore()
const { selectedAlarmFile, notify } = storeToRefs(settings)

// 0 = 停止
// 1 = 倒數中
// 2 = 暫停
const status = ref(0)

let timer = 0
const startTimer = () => {
  if (status.value === 0 && items.value.length > 0
  ) { start() }
  if (currentItem.value.length > 0) {
    status.value = 1
    timer = setInterval(() => {
      countdown()
      if (timeleft.value === 0) {
        finishTimer()
      }
    }, 1000)
  }
}

const currentText = computed(() => {
  return currentItem.value.length > 0 ? currentItem.value : items.value.length > 0 ? '點擊開始' : '沒有事項'
})

// .toString()轉成文字輸出到頁面，.padStart(2, '0')放兩個0
const currentTime = computed(() => {
  const m = Math.floor(timeleft.value / 60).toString().padStart(2, '0')
  const s = (timeleft.value % 60).toString().padStart(2, '0')
  return m + ':' + s
})

// 暫停
const pauseTimer = () => {
  status.value = 2
  clearInterval(timer)
}

// 使用在 跳過 與 時間到
const finishTimer = () => {
  clearInterval(timer)
  status.value = 0

  const audio = new Audio()
  audio.src = selectedAlarmFile.value
  audio.play()

  if (notify.value) {
  // eslint-disable-next-line
    const notification = new Notification('事項完成', {
      body: currentText.value,
      icon: 'https://github.com/wdaweb.png'
    })
  }

  finish()
  if (items.value.length > 0) {
    startTimer()
  }
}

</script>
