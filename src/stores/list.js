import { defineStore } from 'pinia'

const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

export const useListStore = defineStore({
  id: 'list',
  state () {
    return {
      // 新增
      items: [],
      // 已完成
      finishedItems: [],
      // 目前(要計時)
      currentItem: '',
      // 事項唯一值
      id: 1,
      // 休息
      break: false,
      // 預設時間
      timeleft: time
    }
  },
  // 放所有修改state的function
  actions: {
    addItem (name) {
      // 用this.指向state
      this.items.push({
        id: this.id++,
        name,
        edit: false,
        model: name
      })
    },
    // 開啟編輯
    editItem (id) {
      const i = this.getItemIndexById(id)
      // const i =this.items.findIndex(item=>item.id===id)
      this.items[i].edit = true
    },
    delItem (id) {
      const i = this.getItemIndexById(id)
      this.items.splice(i, 1)
    },
    // 確認編輯
    confirmEditItem (id) {
      const i = this.getItemIndexById(id)
      this.items[i].name = this.items[i].model
      this.items[i].edit = false
    },
    // 取消編輯
    undoEditItem (id) {
      const i = this.getItemIndexById(id)
      this.items[i].model = this.items[i].name
      this.items[i].edit = false
    },
    // 取得選擇該項目的 id 值
    getItemIndexById (id) {
      return this.items.findIndex(item => item.id === id)
    },
    // 放在倒數事項中，要扣除其中一個事項
    start () {
      // this.currentItem = this.items[0].name
      // this.items.splice(0, 1)
      this.currentItem = this.break ? '休息一下' : this.items.shift().name
    },
    countdown () {
      this.timeleft--
    },
    finish () {
      if (!this.break) {
        this.finishedItems.push({
          name: this.currentItem,
          id: this.id++
        })
      }
      this.currentItem = ''
      if (this.items.length > 0) {
        this.break = !this.break
      }
      this.timeleft = this.break ? timeBreak : time
    },
    delFinishedItem (id) {
      const i = this.finishedItems.findIndex(item => item.id === id)
      this.finishedItems.splice(i, 1)
    }
  },
  persist: {
    key: 'pomodoro-list'
  }

})
