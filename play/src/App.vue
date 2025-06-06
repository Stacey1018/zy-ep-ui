<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Menu as IconMenu } from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="app-container">
    <div class="app-container-menu">
      <el-menu default-active="2" style="height: 100%" router @open="handleOpen" @close="handleClose">
        <el-menu-item index="/hlbasebutton">
          <el-icon><icon-menu /></el-icon>
          <span>baseButton</span>
        </el-menu-item>
        <el-menu-item index="/hlbutton">
          <el-icon><icon-menu /></el-icon>
          <span>hlbutton</span>
        </el-menu-item>
        <el-menu-item index="/hlcropping">
          <el-icon><icon-menu /></el-icon>
          <span>hlcropping</span>
        </el-menu-item>
        <el-menu-item index="/hlpdfviewer">
          <el-icon><icon-menu /></el-icon>
          <span>hlpdfviewer</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="app-container-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
}
.app-container-menu {
  width: 200px;
}
.app-container-content {
  padding: 20px;
  flex: 1;
}
</style>
