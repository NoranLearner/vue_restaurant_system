<template>
  <div class="container">
    <Navbar />
    <p class="text-end">
      Welcome {{ userName }}
      <router-link :to="{ name: 'profile' }">
        <button class="btn btn-info text-white" type="button">Profile</button>
      </router-link>
    </p>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from "vuex";
export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
    };
  },
  components: { Navbar },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "sign-up" });
    } else {
      this.userName = JSON.parse(user).name;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>
