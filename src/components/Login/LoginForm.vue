<template>
    <form @click.prevent>
            <h1>Login</h1>
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
                    <button type="submit" class="btn btn-secondary">Login Now</button>
                    &nbsp;
                    <!-- <button type="button" class="btn btn-link" @click="signupPage()">Sign Up</button> -->
                    <button type="button" class="btn btn-link" @click="redirectTo({val: 'sign-up'})">Sign Up</button>
                </div>
            </div>
        </form>
</template>

<script>

import {mapActions} from "vuex";

export default {
    name: "LoginForm",
    data() {
        return {
            email: "",
            password: "",
        }
    },
    methods: {
        /* signupPage(){
            // Use name in router file
            this.$router.push({name:'sign-up'});
        }, */
        ...mapActions(['redirectTo'])
    },
}
</script>

<style>

</style>