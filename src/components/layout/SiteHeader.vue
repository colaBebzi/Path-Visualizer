<script setup>
import { Route, ArrowUpRight } from '@lucide/vue';
defineEmits(['open-guide']);
</script>

<template>
  <header class="site-header">
    <a class="brand" href="./" aria-label="Pathfinder home">
      <span class="brand-mark"><Route :size="23" /></span>
      pathfinder
      <span class="brand-dot">.</span>
    </a>
    <div class="header-middle">
      <span class="tiny-dot"></span>
      AN INTERACTIVE ALGORITHM PLAYGROUND
    </div>
    <button class="text-button" @click="$emit('open-guide')">
      How it works
      <ArrowUpRight :size="16" />
    </button>
  </header>
</template>

<style scoped>
.site-header {
  height: 89px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5.1%;
}
.brand {
  display: flex;
  align-items: center;
  font-family: Manrope, sans-serif;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -1.2px;
}
.brand-mark {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  background: var(--purple);
  color: white;
  border-radius: 11px;
  margin-right: 10px;
}
.brand-dot {
  color: var(--purple);
}
.header-middle {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9px;
  letter-spacing: 1.7px;
  color: #85857d;
}
@media (max-width: 1100px) {
  .site-header {
    padding: 0 3%;
  }
  .header-middle {
    font-size: 8px;
  }
}
@media (max-width: 780px) {
  .site-header {
    height: 72px;
    padding: 0 22px;
  }
  .brand {
    font-size: 22px;
  }
  .header-middle {
    display: none;
  }
}
</style>
