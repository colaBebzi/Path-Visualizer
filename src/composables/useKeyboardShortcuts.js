import { onMounted, onUnmounted } from 'vue';
import { tools } from '../constants/tools.js';
export function useKeyboardShortcuts({ help, tool, play }) {
  function shortcuts(event) {
    if (event.key === 'Escape') help.value = false;
    if (
      help.value ||
      /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target.tagName) ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    if (event.code === 'Space') {
      event.preventDefault();
      play();
    }
    const selected = tools.find((item) => item.key.toLowerCase() === event.key.toLowerCase());
    if (selected) tool.value = selected.id;
  }

  onMounted(() => window.addEventListener('keydown', shortcuts));
  onUnmounted(() => window.removeEventListener('keydown', shortcuts));
}
