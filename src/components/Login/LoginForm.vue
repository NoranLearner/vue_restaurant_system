<template>
    <div class="container">
        <h1 class="text-center">Login</h1>
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- https://getbootstrap.com/docs/5.0/forms/floating-labels/ -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="email" class="form-control w300" id="floatingEmail" placeholder="Enter Your Email"
                            v-model.trim="state.email">
                        <label for="floatingEmail">Enter Your Email</label>
                        <span class="error-feedback" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating" :class="{ 'form-group--error': v$.password.$error }">
                        <input type="password" class="form-control w300" id="floatingPassword"
                            placeholder="Enter Your Password" v-model.trim="state.password">
                        <label for="floatingPassword">Enter Your Password</label>
                        <span class="error-feedback" v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" @click="loginUser()" class="btn btn-primary w300"> Login Now </button>
                    <div class="d-flex justify-content-center">
                        <button type="button" @click="redirectTo({ val: 'sign-up' })" class="btn btn-link"> Sign Up
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-danger" v-if="errorMessage.length > 0">
                    {{ errorMessage }}
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
// For redirect to links
import { mapActions } from "vuex";
// For validate data
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
// For Composition Api
import { reactive, computed } from "vue";

export default {
    name: "LoginForm",
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
            successMessage: "",
            errorMessage: "",
        };
    },
    mounted() {
        let user = localStorage.getItem("user-info");
        if (user) {
            this.redirectTo({ val: "home" });
        }
    },
    methods: {

        ...mapActions(["redirectTo"]),

        async loginUser() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log("Form Validated Successfully");
                let result = await axios.get(
                    `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
                );
                if (result.status == 200 && result.data.length > 0) {

                    // save user data in local storage
                    localStorage.setItem("user-info", JSON.stringify(result.data[0]));

                    this.errorMessage = '';
                    this.successMessage = 'Loading....';

                    setTimeout(() => {
                        // redirect to home page
                        this.redirectTo({ val: 'home' });
                    }, 2000);

                } else {
                    this.successMessage = '';
                    this.errorMessage = 'User is invalid!';
                }
            } else {
                this.successMessage = '';
                this.errorMessage = 'You Must Enter Your Email and Password';
            }
        },
    },
};
</script>

<style scoped lang="scss">
.w300 {
    min-width: 300px;
}

.error-feedback,
.form-group--error {
    color: red;
    font-size: 0.85em;
}

.form-group--error input,
.form-group--error textarea,
.form-group--error select {
    border-color: red;
}</style>