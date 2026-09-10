<script setup></script>

<template>
  <footer>
    <span>Made for the joy of figuring things out.</span>
    <span>
      <span class="tiny-dot"></span>
      A playground for curious minds
      <span class="footer-star">✳</span>
    </span>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  padding: 24px 0 25px;
  font-size: 9px;
  color: #a4a095;
}
footer > span:last-child {
  display: flex;
  align-items: center;
  gap: 7px;
}
.footer-star {
  font-size: 20px;
  color: #9aa186;
  margin-left: 12px;
}
@media (max-width: 780px) {
  footer {
    font-size: 8px;
  }
  footer > span:last-child {
    font-size: 0;
  }
  .footer-star {
    font-size: 20px;
  }
}
</style>
