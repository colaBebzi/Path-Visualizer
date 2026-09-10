<script setup>
import { Info, ArrowUpRight } from '@lucide/vue';
defineProps({ info: { type: Object, required: true } });
defineEmits(['open-guide']);
</script>

<template>
  <section class="learning-strip">
    <div class="learning-heading">
      <span class="book-icon"><Info :size="20" /></span>
      <div>
        <span class="eyebrow">BEHIND THE ALGORITHM</span>
        <h3>{{ info.name }}</h3>
      </div>
    </div>
    <p>{{ info.description }}</p>
    <div class="complexity">
      <span>TIME COMPLEXITY</span>
      <strong>{{ info.complexity }}</strong>
    </div>
    <button class="learn-button" aria-label="Learn about pathfinding" @click="$emit('open-guide')">
      <ArrowUpRight :size="20" />
    </button>
  </section>
</template>

<style scoped>
.learning-strip {
  margin-top: 22px;
  border: 1px solid #e2e3d8;
  border-radius: 10px;
  background: #eff0e7;
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 23px 25px;
}
.learning-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 240px;
}
.book-icon {
  color: #8c9873;
  background: #e4e8d8;
  border: 1px solid #dce0cf;
  width: 39px;
  height: 39px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.learning-heading .eyebrow {
  font-size: 8px;
  letter-spacing: 1.4px;
  color: #91947e;
}
.learning-heading h3 {
  font-size: 13px;
  font-weight: 550;
  margin: 7px 0 0;
}
.learning-strip > p {
  font-size: 10px;
  line-height: 1.8;
  color: #8a8b7c;
  max-width: 500px;
  margin: 0;
}
.complexity {
  border-left: 1px solid #dbdfcf;
  margin-left: auto;
  padding-left: 25px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  white-space: nowrap;
}
.complexity > span {
  font-size: 7px;
  letter-spacing: 1px;
  color: #929781;
}
.complexity > strong {
  font-family: monospace;
  font-weight: 400;
  font-size: 14px;
  color: #707c5e;
}
.learn-button {
  border: 1px solid #d9deca;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #879473;
  flex-shrink: 0;
}
@media (max-width: 1100px) {
  .learning-strip {
    gap: 20px;
    padding: 20px;
  }
  .learning-heading {
    min-width: 200px;
  }
  .complexity {
    padding-left: 16px;
  }
}
@media (max-width: 780px) {
  .learning-strip {
    gap: 15px;
    flex-wrap: wrap;
    padding: 20px;
  }
  .learning-heading {
    min-width: 0;
    flex: 1;
  }
  .learning-strip > p {
    order: 3;
    max-width: none;
    width: 100%;
    font-size: 11px;
  }
  .complexity {
    margin-left: 0;
    padding-left: 12px;
  }
  .learn-button {
    display: none;
  }
}
</style>
