<script setup>
import { computed } from 'vue';
import { Check, Route } from '@lucide/vue';
const props = defineProps({
  status: { type: String, required: true },
  visitedCount: { type: Number, required: true },
  pathLength: { type: Number, required: true },
  availableNodes: { type: Number, required: true },
  elapsed: { type: Number, required: true },
  progress: { type: Number, required: true },
});
const statusText = computed(
  () =>
    ({
      idle: 'Ready to explore',
      running: 'Finding a way…',
      paused: 'Exploration paused',
      done: 'Path found',
      unreachable: 'No path found',
    })[props.status],
);
</script>

<template>
  <div class="results" aria-live="polite">
    <div class="result-status">
      <span :class="['status-icon', { complete: status === 'done' }]">
        <Check v-if="status === 'done'" :size="17" />
        <Route v-else :size="17" />
      </span>
      <div>
        <strong>{{ statusText }}</strong>
        <span>
          {{
            status === 'unreachable'
              ? 'Try removing a few walls.'
              : status === 'done'
                ? 'A small journey, beautifully solved.'
                : 'Let’s connect the dots.'
          }}
        </span>
      </div>
    </div>
    <div class="stat">
      <span>Nodes visited</span>
      <strong>
        {{ visitedCount }}
        <small>/ {{ availableNodes }}</small>
      </strong>
    </div>
    <div class="stat">
      <span>Path length</span>
      <strong>
        {{ status === 'done' ? pathLength : '—' }}
        <small>steps</small>
      </strong>
    </div>
    <div class="stat">
      <span>Compute time</span>
      <strong>
        {{ elapsed ? elapsed.toFixed(1) : '—' }}
        <small>ms</small>
      </strong>
    </div>
  </div>
  <div class="progress-track">
    <div :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<style scoped>
.results {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  border-top: 1px solid var(--line);
  background: #f9f9f4;
  padding: 20px 22px;
  gap: 12px;
}
.result-status {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: #eeede5;
  color: #929681;
  flex-shrink: 0;
}
.status-icon.complete {
  background: #e6efdf;
  color: #769268;
}
.result-status > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.result-status strong {
  font-size: 10px;
  font-weight: 550;
}
.result-status > div > span {
  font-size: 8px;
  color: #99968a;
}
.stat {
  border-left: 1px solid var(--line);
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat > span {
  font-size: 9px;
  color: #959182;
}
.stat > strong {
  font-family: Manrope, sans-serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1;
}
.stat small {
  font-family: 'DM Sans', sans-serif;
  font-size: 8px;
  font-weight: 400;
  color: #a39f91;
  margin-left: 6px;
}
.progress-track {
  height: 3px;
  background: #eeece4;
}
.progress-track > div {
  height: 100%;
  background: #af97d8;
  transition: width 0.15s linear;
}
@media (max-width: 1100px) {
  .results {
    padding: 18px 15px;
    gap: 8px;
    grid-template-columns: 1.35fr 1fr 1fr 1fr;
  }
  .stat {
    padding-left: 12px;
  }
  .result-status {
    gap: 6px;
  }
  .result-status > div > span {
    display: none;
  }
}
@media (max-width: 780px) {
  .results {
    padding: 19px 15px;
  }
  .result-status strong {
    font-size: 9px;
  }
  .stat > strong {
    font-size: 19px;
  }
}
@media (max-width: 420px) {
  .results {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  .result-status {
    grid-column: 1/-1;
  }
  .result-status > div > span {
    display: block;
  }
  .stat {
    padding-left: 12px;
  }
  .stat:nth-child(2) {
    border: 0;
    padding-left: 0;
  }
}
</style>
