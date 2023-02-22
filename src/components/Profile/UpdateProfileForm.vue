<template>
    <div class="container">
        <Navbar />
        <form @click.prevent>
            <h1 class="text-center">Update Your Profile</h1>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name">
                    <span class="error-feedback" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email">
                    <span class="error-feedback" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="password" class="form-control" placeholder="Enter Your Password" v-model="password">
                    <span class="error-feedback" v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" @click="updateProfileNow()" class="btn btn-primary">Update Profile Now</button>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto error-feedback">
                    {{ updateError }}
                </div>
            </div>
        </form>

    </div>
</template>

<script>
import Navbar from '@/components/Header/Navbar.vue';
import axios from "axios";
// For redirect to links
import { mapActions } from "vuex";
// For validate data
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
    name: "UpdateProfileForm",
    components: { Navbar },
    data() {
        return {
            v$: useValidate(),
            name: "",
            email: "",
            password: "",
            userId: "",
            updateError: "",
        }
    },
    validations() {
        return {
            name: { required, minLength: minLength(10) },
            email: { required, email },
            password: { required, minLength: minLength(10) },
        }
    },
    mounted() {
        let user = localStorage.getItem("user-info");
        if (user) {
            this.name = JSON.parse(user).name;
            this.email = JSON.parse(user).email;
            this.password = JSON.parse(user).password;
            this.userId = JSON.parse(user).id;
        } else {
            this.redirectTo({ val: 'sign-up' });
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        async updateProfileNow() {
            this.v$.$validate();
            if (!this.v$.$error) { 
                console.log("Form Validated Successfully");
                // Update Date
                let result = await axios.put(`http://localhost:3000/users/${this.userId}`, {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });
                if (result.status == 200) {
                    console.log("Profile is Updated Successfully");
                    // save user data in local storage
                    localStorage.setItem("user-info", JSON.stringify(result.data));
                    // redirect to home page
                    this.redirectTo({ val: 'profile' });
                    // this.$router.push({ name: "profile", params:{pageTitle: "Profile Page"}})
                } else {
                    this.updateError = "Something Went Wrong, Try Again";
                }
            } else {
                this.updateError = "Something Went Wrong, Refresh The Page";
            }
        },
    },
}
</script>

<style scoped lang="scss">
.error-feedback {
    color: red;
    font-size: 0.85em;
}
</style>