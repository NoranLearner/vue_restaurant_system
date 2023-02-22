<template>
  <Navbar/>
  <div class="home">
    <h1>This is home page</h1>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from 'vuex';
export default {
  name: 'HomeView',
  components:{ Navbar },
  mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            this.redirectTo({ val: 'sign-up' });
        }
    },
  methods: {
    ...mapActions(['redirectTo']),
  },
}
</script>
