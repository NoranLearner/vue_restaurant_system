<template>
  <div class="container">
    <Navbar />
    <p class="text-end">
      Welcome {{ userName }}
      <router-link :to="{ name: 'profile' }">
        <button class="btn btn-info text-white" type="button">Profile</button>
      </router-link>
    </p>
    <router-link :to="{ name: 'add-new-location' }">
      <button type="button" class="btn btn-primary">
        Add New Restaurant
      </button>
    </router-link>
    <UserLocations :allLocations="listOfLocations" />
  </div>
</template>

<script>
import axios from "axios";
// For redirect to links
import { mapActions } from "vuex";
import Navbar from '@/components/Header/Navbar.vue';
import UserLocations from "@/components/Locations/UserLocations.vue";
export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOfLocations: [],
    };
  },
  components: { Navbar, UserLocations },
  async mounted() {
    let user = localStorage.getItem('user-info');
    if (!user) {
      // Using name in router file
      this.redirectTo({ val: 'sign-up' });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
    if (result.status == 200 && result.data.length > 0) {
      // console.log(result.data);
      this.listOfLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>
