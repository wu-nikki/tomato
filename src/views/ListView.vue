<template lang="pug">
v-row#list
  v-col.v-col-12.v-col-sm-6
    v-col(cols="12")
      h2.text-center 待辦事項
    v-col(cols="12")
      v-text-field(
  ref="input" v-model="newItem" label="新增事項" variant="solo" placeholder="新增事項" :rules=" [rules.required,rules.length]"
        @keydown.enter="onInputSubmit")
          template(#append)
            v-btn(icon="mdi-plus" variant="text" color="redLighten" @click="onInputSubmit" )
      v-table
        thead
          tr
            th 名稱
            th 操作
        tbody
          tr(v-if="items.length===0")
            td.text-center(colspan="2") 目前沒有事項
          tr(v-for="item in items" :key="item.id" ref="editInputs" )
            td
              v-text-field(v-if="item.edit" v-model="item.model" autofocus :rules="[rules.required,rules.length] ")
              span(v-else) {{ item.name }}
            td
              span(v-if="item.edit")
                v-btn(icon="mdi-check" variant="text" color="greenDarken" @click="confirmEditItem(item.id) ")
                v-btn(icon="mdi-undo" variant="text" color="redLighten" @click="undoEditItem(item.id) ")
              span(v-else)
                v-btn(
  icon="mdi-pencil"
                variant="text"
                color="greenDarken" @click="editItem(item.id)")
                v-btn(icon="mdi-delete" variant="text" color="redLighten" @click="delItem(item.id)")
    v-divider
    v-divider
  v-col.v-col-12.v-col-sm-6
    v-col(cols="12")
      h2.text-center 已完成事項
        v-table
          thead
            tr
              th 名稱
              th 操作
          tbody
            tr(v-if="finishedItems.length===0")
              td.text-center(colspan="2") 目前沒有事項
            tr(v-for="item in finishedItems" v-else :key="item.id" ref="editInputs" )
              td {{ item.name }}
              td
                v-btn(icon="mdi-delete" variant="text" color="redLighten" @click="delFinishedItem(item.id)")
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '@/stores/list'

const list = useListStore()
const { addItem, editItem, delItem, confirmEditItem, undoEditItem, delFinishedItem } = list
const { items, finishedItems } = storeToRefs(list)

const newItem = ref('')
const input = ref(null)
const editInputs = ref([])

const rules = {
  required (v) {
    return !!v || '欄位必填'
  },
  length (v) {
    return v.length >= 2 || '必須兩個字以上'
  }
}

const onInputSubmit = async () => {
  const valid = await input.value.validate()
  if (valid.length > 0) return
  addItem(newItem.value)

  // 這行是給欄位填完後不會有紅字
  input.value.$el.querySelector('input').blur()

  input.value.reset()
}
</script>
