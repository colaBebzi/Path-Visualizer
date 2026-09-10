<script setup>
import { Sparkles } from '@lucide/vue';
</script>

<template>
  <section class="intro">
    <div>
      <div class="eyebrow">
        <span></span>
        THE BEAUTY IS IN THE JOURNEY
      </div>
      <h1>
        Every path starts
        <br class="mobile-break" />
        with
        <span>curiosity.</span>
      </h1>
      <p>Build a world. Pick an algorithm. Watch a little logic find its way.</p>
    </div>
    <div class="intro-note">
      <Sparkles :size="20" />
      <span>
        A little space for
        <br />
        big discoveries.
      </span>
      <svg viewBox="0 0 65 40" aria-hidden="true">
        <path d="M5 5Q50 0 44 31m-9-9 9 10 11-10" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 0 34px;
}
h1 {
  font-family: Manrope, sans-serif;
  font-size: clamp(32px, 3.3vw, 49px);
  font-weight: 650;
  letter-spacing: -2.1px;
  line-height: 1.24;
  margin: 12px 0 13px;
}
h1 > span {
  color: var(--purple);
}
.intro p {
  color: #85857e;
  font-size: 13px;
  margin: 0;
}
.mobile-break {
  display: none;
}
.intro-note {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #939781;
  position: relative;
  margin-right: 35px;
  margin-top: 10px;
}
.intro-note > span {
  font-size: 12px;
  line-height: 1.7;
  transform: rotate(-5deg);
}
.intro-note > svg:last-child {
  position: absolute;
  width: 65px;
  right: -26px;
  top: 42px;
  fill: none;
  stroke: #b4b6a5;
  stroke-width: 1.5;
}
@media (min-width: 1500px) {
  .intro {
    padding-top: 52px;
    padding-bottom: 42px;
  }
}
@media (max-width: 1100px) {
  .intro-note {
    margin-right: 20px;
  }
}
@media (max-width: 780px) {
  .intro {
    padding: 32px 0 27px;
  }
  .intro-note {
    display: none;
  }
  h1 {
    font-size: 35px;
    letter-spacing: -1.4px;
  }
  .intro p {
    font-size: 11px;
  }
}
@media (max-width: 420px) {
  .mobile-break {
    display: block;
  }
  .intro p {
    max-width: 280px;
    line-height: 1.8;
  }
}
</style>
