<template>
    <form @click.prevent>
        <h1 class="text-center">Login</h1>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="email" class="form-control" placeholder="Enter Your Email" v-model="state.email" />
                <span class="error-feedback" v-if="v$.email.$error">{{
                    v$.email.$errors[0].$message
                }}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="password" class="form-control" placeholder="Enter Your Password" v-model="state.password" />
                <span class="error-feedback" v-if="v$.password.$error">{{
                    v$.password.$errors[0].$message
                }}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <button type="submit" class="btn btn-secondary" @click="loginUser()">
                    Login Now
                </button>
                &nbsp;
                <!-- <button type="button" class="btn btn-link" @click="signupPage()">Sign Up</button> -->
                <button type="button" class="btn btn-link" @click="redirectTo({ val: 'sign-up' })">
                    Sign Up
                </button>
            </div>
        </div>
        <br/>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto error-feedback">
                {{ userNotFoundError }}
            </div>
        </div>
    </form>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
// For Composition Api
import { reactive, computed } from "vue";
export default {
    name: "LoginForm",
    // Composition API
    setup() {
        // Data
        const state = reactive({
            email: "",
            password: "",
        });
        // Validations
        const rules = computed(() => {
            return {
                email: { required, email },
                password: { required },
            };
        });
        // Write rules first
        const v$ = useValidate(rules, state);
        return { state, v$ };
    },
    data() {
        return {
            userNotFoundError:"",
        };
    },
    mounted() {
        let user = localStorage.getItem('user-info');
        if (user) {
            this.redirectTo({ val: 'home' });
        }
    },
    methods: {
        /* signupPage(){
                // Use name in router file
                this.$router.push({name:'sign-up'});
            }, */
        ...mapActions(["redirectTo"]),
        async loginUser() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log("Form Validated Successfully");

                let result = await axios.get(
                    `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
                );
                // console.log(result.data);
                if (result.status == 200 && result.data.length > 0) { 
                    // save user data in local storage
                    localStorage.setItem("user-info", JSON.stringify(result.data[0]));
                    // redirect to home page
                    this.redirectTo({ val: 'home' });
                } else {
                    this.userNotFoundError = "User Not Found";
                }
            } else {
                console.log("Form Validation Failed");
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.error-feedback {
    color: red;
    font-size: 0.85em;
}
</style>