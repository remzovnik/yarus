<script setup lang="ts"></script>

<template>
  <div class="list-layout">
    <div class="list-layout__header">
      <slot name="header" />
    </div>

    <div class="list-layout__list">
      <slot name="list" />
    </div>
  </div>
</template>

<style lang="scss">
.list-layout {
  &__list {
    margin-top: 24px;
  }
}
</style>
