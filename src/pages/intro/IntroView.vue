<template>
  <OnboardingIntro @skip="finish" @done="finish" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import OnboardingIntro from './IntroOnboarding.vue';

const router = useRouter();
const finish = () => {
  localStorage.setItem('mb_seen_intro', '1');
  router.replace({ name: 'login' });
};
</script>
