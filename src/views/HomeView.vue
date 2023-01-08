<template lang="pug">
v-row#home
  v-col#left.v-col-12.v-col-sm-6
    v-col(cols="12")
      h1 {{ currentTime }}

      h2 {{ currentText }}

    v-col(cols="12")
      v-btn(v-if="status!==1" icon="mdi-play" color="redDarken2" variant="flat" @click="startTimer")
      v-btn(v-else icon="mdi-pause" variant="flat" color="redLighten" @click="pauseTimer")
      v-btn(v-if="currentItem.length >0" icon="mdi-skip-next" variant="flat" color="redLighten" @click="finishTimer")
    v-col(cols="12")
      img(src="../assets/番茄種子.gif")

  v-col#right.v-col-12.v-col-sm-6
    v-col.top(cols="12")
      v-col.title(cols="12")
        img(src="../assets/小裝飾.png")
        h2.text-center 待辦事項
      v-col.list(cols="12")
        v-table
          tbody
          tr(v-if="items.length===0")
            td.text-center(colspan="2") 目前沒有事項
          tr(v-for="item in items" :key="item.id" ref="editInputs" )
            td
              v-text-field(v-if="item.edit" v-model="item.model" autofocus :rules="[rules.required,rules. length]")
              h1(v-else) {{ item.name }}
    v-col.bottom(cols="12")
      v-col.title(cols="12")
        img(src="../assets/小裝飾.png")
        h2.text-center 已完成事項
      v-col.list(cols="12")
        v-table
          tbody
            tr(v-if="finishedItems.length===0")
              td.text-center(colspan="2") 目前沒有事項
            tr(v-for="item in finishedItems" v-else :key="item.id" ref="editInputs" )
              h3 {{ item.name }}
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
const { currentItem, items, timeleft, finishedItems } = storeToRefs(list)
const { start, countdown, finish } = list

const settings = useSettingsStore()
const { selectedAlarmFile, notify } = storeToRefs(settings)

// 0 = 停止
// 1 = 倒數中
// 2 = 暫停
const status = ref(0)

let timer = 0
const startTimer = () => {
  if (status.value === 0 && items.value.length > 0) {
    start()
  }
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
  return currentItem.value.length > 0
    ? currentItem.value
    : items.value.length > 0
      ? '點擊開始'
      : '沒有事項'
})

// .toString()轉成文字輸出到頁面，.padStart(2, '0')放兩個0
const currentTime = computed(() => {
  const m = Math.floor(timeleft.value / 60)
    .toString()
    .padStart(2, '0')
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
    const notification = new Notification("事項完成", {
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
