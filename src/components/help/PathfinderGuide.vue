<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { X, Keyboard, ArrowRight } from '@lucide/vue';
defineEmits(['close']);
const dialog = ref(null);
let previousFocus;
onMounted(() => {
  previousFocus = document.activeElement;
  dialog.value.querySelector('button')?.focus();
});
onBeforeUnmount(() => previousFocus?.focus());

function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const buttons = event.currentTarget.querySelectorAll('button');
  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')" @keydown.esc="$emit('close')">
    <section
      ref="dialog"
      class="help-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      @keydown="trapFocus"
    >
      <button class="close-button" aria-label="Close guide" autofocus @click="$emit('close')">
        <X :size="20" />
      </button>
      <span class="eyebrow">A QUICK FIELD GUIDE</span>
      <h2 id="help-title">Follow your curiosity.</h2>
      <p>
        Every square is a node. Every move costs one step. The challenge? Connect the green start to
        the coral finish.
      </p>
      <ol>
        <li>
          <strong>Build a little world.</strong>
          Draw walls, choose a maze, or drag the start and end markers. Walls are off limits to the
          search.
        </li>
        <li>
          <strong>Pick a perspective.</strong>
          Dijkstra and BFS explore outward. A* heads toward the goal. DFS dives into one branch at a
          time.
        </li>
        <li>
          <strong>Watch it unfold.</strong>
          Violet squares show explored nodes. The golden trail is the final route. Pause or step to
          look closer.
        </li>
      </ol>
      <div class="help-tip">
        <Keyboard :size="18" />
        <span>
          <kbd>Space</kbd>
          play / pause ·
          <kbd>W</kbd>
          walls ·
          <kbd>E</kbd>
          erase
          <br />
          <kbd>S</kbd>
          start ·
          <kbd>F</kbd>
          finish · Arrow keys + Enter to edit the grid
        </span>
      </div>
      <button class="primary-button" @click="$emit('close')">
        Let’s find a path
        <ArrowRight :size="17" />
      </button>
    </section>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #30342c65;
  z-index: 10;
  display: grid;
  place-items: center;
  backdrop-filter: blur(5px);
  padding: 20px;
}
.help-dialog {
  position: relative;
  background: #fafaf5;
  max-width: 480px;
  padding: 36px;
  border-radius: 18px;
  box-shadow: 0 20px 100px #20271d33;
}
.close-button {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
}
.help-dialog h2 {
  font-family: Manrope, sans-serif;
  font-size: 29px;
  letter-spacing: -1px;
  margin: 14px 0;
}
.help-dialog p,
.help-dialog li {
  font-size: 12px;
  line-height: 1.8;
  color: #838476;
}
.help-dialog ol {
  padding-left: 18px;
}
.help-dialog li {
  padding: 6px 0;
}
.help-dialog li strong {
  color: #555c4d;
}
.help-tip {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #efeee5;
  padding: 13px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 10px;
  line-height: 2;
  color: #838675;
}
.help-dialog .primary-button > svg {
  margin: 0;
}
</style>
