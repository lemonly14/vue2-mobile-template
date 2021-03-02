<template>
  <div class="app-wrapper">
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    AppMain
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
