<template>
    <div class="container">
        <Navbar />
        <form @click.prevent>
            <h1 class="text-center">Update Your Profile</h1>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input disabled type="text" class="form-control" placeholder="Enter Your Name" v-model="name" />
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input disabled type="email" class="form-control" placeholder="Enter Your Email" v-model="email" />
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input disabled type="password" class="form-control" placeholder="Enter Your Password" v-model="password" />
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" @click="updateProfile()" class="btn btn-primary">
                        Update Profile Now
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from "vuex";
export default {
    name: "ProfileForm",
    components: { Navbar },
    data() {
        return {
            name: "",
            email: "",
            password: "",
        }
    },
    mounted() {
        let user = localStorage.getItem("user-info");
        if (user) {
            this.name = JSON.parse(user).name;
            this.email = JSON.parse(user).email;
            this.password = JSON.parse(user).password;
        } else {
            this.redirectTo({ val: 'sign-up' });
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        updateProfile() {
            this.redirectTo({ val: 'update-profile' });
        },
    },
};
</script>

<style></style>