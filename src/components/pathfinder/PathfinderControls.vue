<script setup>
import { computed } from 'vue';
import {
  ChevronDown,
  Check,
  Info,
  WandSparkles,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
  MousePointer2,
} from '@lucide/vue';
import { algorithms } from '../../constants/algorithms.js';
import { tools } from '../../constants/tools.js';
const algorithm = defineModel('algorithm', { type: String, required: true });
const tool = defineModel('tool', { type: String, required: true });
const preset = defineModel('preset', { type: String, required: true });
const speed = defineModel('speed', { type: Number, required: true });
const props = defineProps({ locked: Boolean, status: { type: String, required: true } });
defineEmits(['clear-search', 'generate', 'play', 'step', 'reset']);
const info = computed(() => algorithms[algorithm.value]);
const speedLabel = computed(() => {
  if (speed.value < 35) return 'Slow';
  if (speed.value < 75) return 'Medium';
  return 'Fast';
});
const playLabel = computed(() => {
  if (props.status === 'running') return 'Pause exploration';
  if (props.status === 'paused') return 'Resume exploration';
  return 'Visualize path';
});
</script>

<template>
  <aside class="controls">
    <div class="panel-title">
      <span>Make it your own</span>
      <span class="small-index">01 — 03</span>
    </div>
    <section class="control-section">
      <label class="section-label" for="algorithm">
        <span class="step-number">01</span>
        Choose an algorithm
      </label>
      <div class="select-wrap">
        <select
          id="algorithm"
          v-model="algorithm"
          :disabled="locked"
          @change="$emit('clear-search')"
        >
          <option v-for="(item, key) in algorithms" :key="key" :value="key">
            {{ item.name }}
          </option>
        </select>
        <ChevronDown :size="15" />
      </div>
      <p class="control-hint">{{ info.tag }}</p>
      <div class="algorithm-tags">
        <span :class="{ amber: !info.optimal }">
          <Check v-if="info.optimal" :size="12" />
          <Info v-else :size="12" />
          {{ info.optimal ? 'Shortest path' : 'Not always shortest' }}
        </span>
        <span>Unweighted grid</span>
      </div>
    </section>
    <section class="control-section">
      <div class="section-label">
        <span class="step-number">02</span>
        Shape your playground
      </div>
      <div class="drawing-tools">
        <button
          v-for="item in tools"
          :key="item.id"
          :class="['tool-button', { selected: tool === item.id }]"
          :disabled="locked"
          :aria-pressed="tool === item.id"
          @click="tool = item.id"
        >
          <component :is="item.icon" :size="17" />
          <span>{{ item.label }}</span>
          <kbd>{{ item.key }}</kbd>
        </button>
      </div>
      <div class="maze-control">
        <label class="sr-only" for="maze">Maze style</label>
        <select id="maze" v-model="preset" :disabled="locked">
          <option value="division">Switchback maze</option>
          <option value="random">Random terrain</option>
        </select>
        <button
          :disabled="locked"
          title="Generate maze"
          aria-label="Generate maze"
          @click="$emit('generate')"
        >
          <WandSparkles :size="17" />
        </button>
      </div>
    </section>
    <section class="control-section speed-section">
      <label class="section-label" for="speed">
        <span class="step-number">03</span>
        Set the pace
        <span class="speed-value">{{ speedLabel }}</span>
      </label>
      <input
        id="speed"
        v-model.number="speed"
        type="range"
        min="1"
        max="100"
        :style="{ '--range-progress': `${speed}%` }"
      />
      <div class="range-labels">
        <span>Take it in</span>
        <span>Let it fly</span>
      </div>
    </section>
    <div class="play-controls">
      <button class="primary-button" @click="$emit('play')">
        <Pause v-if="status === 'running'" :size="16" fill="currentColor" />
        <Play v-else :size="16" fill="currentColor" />
        {{ playLabel }}
        <kbd>␣</kbd>
      </button>
      <div class="secondary-controls">
        <button @click="$emit('step')">
          <SkipForward :size="14" />
          Step
        </button>
        <button @click="$emit('reset')">
          <RotateCcw :size="14" />
          Reset grid
        </button>
      </div>
    </div>
    <div class="sidebar-note">
      <MousePointer2 :size="17" />
      <p>
        Click & drag to draw walls.
        <br />
        Move the markers to explore more.
      </p>
    </div>
  </aside>
</template>

<style scoped>
.controls {
  background: #fcfcf9;
  border: 1px solid var(--line);
  border-radius: 13px;
  overflow: hidden;
  padding: 22px 20px 0;
}
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 23px;
}
.small-index {
  font-family: monospace;
  font-size: 9px;
  color: #a1a196;
  font-weight: 400;
}
.control-section {
  margin-bottom: 24px;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
}
.step-number {
  font-size: 9px;
  color: #9b9b8f;
  font-weight: 500;
}
.select-wrap {
  position: relative;
}
.select-wrap > svg {
  position: absolute;
  right: 12px;
  top: 15px;
  pointer-events: none;
  color: #8b8a85;
}
.control-hint {
  font-size: 10px;
  color: #939187;
  margin: 9px 0 11px;
}
.algorithm-tags {
  display: flex;
  gap: 5px;
}
.algorithm-tags > span {
  display: flex;
  align-items: center;
  gap: 3px;
  border-radius: 4px;
  background: #eff2e8;
  color: #718153;
  font-size: 8px;
  padding: 5px 6px;
  white-space: nowrap;
}
.algorithm-tags > span:last-child {
  background: #f1f0eb;
  color: #8c897e;
}
.algorithm-tags > span.amber {
  color: #a67937;
  background: #fbf2df;
}
.drawing-tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}
.tool-button {
  justify-content: flex-start;
  height: 41px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0 8px;
  font-size: 10px;
  gap: 6px;
  background: #fff;
}
.tool-button > svg {
  flex-shrink: 0;
  color: #83847a;
}
.tool-button > kbd {
  margin-left: auto;
  font-size: 8px;
  color: #aaa89e;
}
.tool-button.selected {
  background: #eeebf8;
  border-color: #c9bce9;
  color: #7254ba;
}
.tool-button.selected > svg {
  color: #8062c9;
}
.maze-control {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}
.maze-control select {
  padding: 10px 8px;
  background: #f5f4ef;
  color: #77796d;
  font-size: 10px;
}
.maze-control button {
  border: 1px solid #dfdfd5;
  border-radius: 6px;
  flex-shrink: 0;
  width: 37px;
  background: #f5f4ef;
  color: #77796d;
}
.speed-section {
  margin-top: 25px;
  margin-bottom: 23px;
}
.speed-value {
  margin-left: auto;
  color: #8c74bd;
  font-weight: 500;
  font-size: 10px;
}
input[type='range'] {
  appearance: none;
  width: 100%;
  height: 4px;
  margin: 6px 0 12px;
  border-radius: 6px;
  background: linear-gradient(
    to right,
    #9a84d3 var(--range-progress),
    #e9e5ef var(--range-progress)
  );
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #9474ce;
  box-shadow: 0 0 0 1px #b9a5df;
}
.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #9c998f;
}
.secondary-controls {
  display: flex;
  margin-top: 9px;
  gap: 8px;
}
.secondary-controls > button {
  flex: 1;
  font-size: 10px;
  height: 31px;
  color: #8c897d;
}
.secondary-controls > button + button {
  border-left: 1px solid var(--line);
}
.sidebar-note {
  display: flex;
  gap: 9px;
  align-items: center;
  border-top: 1px solid var(--line);
  margin: 17px -20px 0;
  padding: 15px 20px;
  background: #f6f6f0;
  color: #8b8e7b;
}
.sidebar-note svg {
  flex-shrink: 0;
}
.sidebar-note p {
  font-size: 9px;
  line-height: 1.7;
  margin: 0;
}
@media (min-width: 1500px) {
  .controls {
    padding-top: 27px;
  }
  .control-section {
    margin-bottom: 30px;
  }
  .panel-title {
    margin-bottom: 28px;
  }
  .tool-button {
    height: 45px;
  }
  .sidebar-note {
    margin-top: 24px;
  }
}
@media (max-width: 1100px) {
  .controls {
    padding-left: 15px;
    padding-right: 15px;
  }
  .sidebar-note {
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .tool-button {
    padding: 0 6px;
    gap: 4px;
    font-size: 9px;
  }
}
@media (max-width: 780px) {
  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 22px;
    padding: 18px;
  }
  .panel-title {
    grid-column: 1/-1;
    margin-bottom: 20px;
  }
  .control-section {
    margin-bottom: 18px;
  }
  .speed-section {
    margin-top: 0;
    margin-bottom: 0;
  }
  .play-controls {
    align-self: center;
  }
  .sidebar-note {
    display: none;
  }
  .tool-button {
    font-size: 10px;
    height: 37px;
  }
  .control-hint {
    font-size: 9px;
  }
  .tool-button > kbd {
    display: none;
  }
}
@media (max-width: 420px) {
  .controls {
    gap: 0 14px;
    padding: 15px;
  }
  .algorithm-tags {
    flex-wrap: wrap;
  }
  .tool-button {
    gap: 5px;
    font-size: 9px;
  }
  .tool-button svg {
    width: 14px;
  }
  .section-label {
    font-size: 10px;
    gap: 5px;
  }
  .secondary-controls > button {
    font-size: 9px;
    gap: 4px;
  }
}
</style>
