<script setup>
import { computed, ref } from 'vue';
import SiteHeader from '../components/layout/SiteHeader.vue';
import StudioIntro from '../components/layout/StudioIntro.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';
import PathfinderControls from '../components/pathfinder/PathfinderControls.vue';
import PathfinderGrid from '../components/pathfinder/PathfinderGrid.vue';
import SearchResults from '../components/pathfinder/SearchResults.vue';
import AlgorithmDetails from '../components/pathfinder/AlgorithmDetails.vue';
import PathfinderGuide from '../components/help/PathfinderGuide.vue';
import { algorithms } from '../constants/algorithms.js';
import { usePathfinder } from '../composables/usePathfinder.js';
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts.js';
const {
  rows,
  cols,
  start,
  finish,
  walls,
  algorithm,
  tool,
  speed,
  preset,
  visited,
  path,
  status,
  elapsed,
  locked,
  progress,
  clearSearch,
  play,
  step,
  reset,
  generate,
  paint,
} = usePathfinder();
const help = ref(false);
const info = computed(() => algorithms[algorithm.value]);
useKeyboardShortcuts({ help, tool, play });
</script>
<template>
  <div class="app-shell">
    <SiteHeader @open-guide="help = true" />
    <main>
      <StudioIntro />
      <div class="studio">
        <PathfinderControls
          v-model:algorithm="algorithm"
          v-model:tool="tool"
          v-model:preset="preset"
          v-model:speed="speed"
          :locked="locked"
          :status="status"
          @clear-search="clearSearch"
          @generate="generate"
          @play="play"
          @step="step"
          @reset="reset"
        />
        <section class="workspace" aria-label="Pathfinding playground">
          <PathfinderGrid
            :rows="rows"
            :cols="cols"
            :start="start"
            :finish="finish"
            :walls="walls"
            :visited="visited"
            :path="path"
            :tool="tool"
            :locked="locked"
            :status="status"
            @paint="paint"
            @clear-search="clearSearch"
          />
          <SearchResults
            :status="status"
            :visited-count="visited.size"
            :path-length="Math.max(0, path.size - 1)"
            :available-nodes="rows * cols - walls.size"
            :elapsed="elapsed"
            :progress="progress"
          />
        </section>
      </div>
      <AlgorithmDetails :info="info" @open-guide="help = true" />
      <SiteFooter />
    </main>
    <PathfinderGuide v-if="help" @close="help = false" />
  </div>
</template>
