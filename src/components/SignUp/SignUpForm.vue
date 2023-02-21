<template>
    <form @click.prevent>
        <h1>Sign Up</h1>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name">
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email">
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="password" class="form-control" placeholder="Enter Your Password" v-model="password">
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <button type="submit" class="btn btn-secondary">Sign Up Now</button>
                &nbsp;
                <!-- <button type="button" class="btn btn-link" @click="loginPage()">Login</button> -->
                <button type="button" class="btn btn-link" @click="redirectTo({val: 'login'})">Login</button>
            </div>
        </div>
    </form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: "SignUpForm",
    data() {
        return {
            name: "",
            email: "",
            password:"",
        }
    },
    methods: {
        /* loginPage(){
            // Use name in router file
            this.$router.push({name:'login'});
        }, */
        ...mapActions(['redirectTo']),
    },
}
</script>

<style></style>