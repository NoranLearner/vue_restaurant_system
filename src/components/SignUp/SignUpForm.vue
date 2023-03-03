<template>
    <div class="container">
        <h1 class="text-center">Sign Up</h1>
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- https://getbootstrap.com/docs/5.0/forms/floating-labels/ -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="text" class="form-control w300" id="floatingEmail" placeholder="Enter Your Name"
                            v-model.trim="name">
                        <label for="floatingEmail">Enter Your Name</label>
                        <span class="error-feedback" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="email" class="form-control w300" id="floatingEmail" placeholder="Enter Your Email"
                            v-model.trim="email">
                        <label for="floatingEmail">Enter Your Email</label>
                        <span class="error-feedback" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating" :class="{ 'form-group--error': v$.password.$error }">
                        <input type="password" class="form-control w300" id="floatingPassword"
                            placeholder="Enter Your Password" v-model.trim="password">
                        <label for="floatingPassword">Enter Your Password</label>
                        <span class="error-feedback" v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">

                    <button type="submit" @click="validateEmail()" class="btn btn-primary w300"> Sign Up Now </button>

                    <div class="d-flex justify-content-center">
                        <button type="button" @click="redirectTo({ val: 'login' })" class="btn btn-link">Have an account,
                            Login Now</button>
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
import { required, email, minLength } from "@vuelidate/validators";

export default {
    name: 'SignUpForm',
    data() {
        return {
            v$: useValidate(),
            name: '',
            email: '',
            password: '',
            successMessage: "",
            errorMessage: "",
            userEmailExists: '',
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
        let user = localStorage.getItem('user-info');
        if (user) {
            this.redirectTo({ val: 'home' });
        }
    },
    methods: {

        ...mapActions(['redirectTo']),

        async validateEmail() {
            let res = await axios.get(`http://localhost:3000/users?email=${this.email}`);
            if (res.status == 200) {
                this.userEmailExists = res.data;
                if (this.userEmailExists.length != 1) {
                    this.successMessage = "";
                    this.errorMessage = "";
                    this.signUpNow();
                } else {
                    this.successMessage = "";
                    this.errorMessage = "This email already exists";
                }
            }
        },

        async signUpNow() {
            this.v$.$validate();
            if (!this.v$.$error) {

                let result = await axios.post('http://localhost:3000/users', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });

                if (result.status == 201) {

                    // save user data in local storage
                    localStorage.setItem("user-info", JSON.stringify(result.data));

                    this.errorMessage = '';
                    this.successMessage = 'Loading ....';

                    setTimeout(() => {
                        // redirect to home page
                        this.redirectTo({ val: 'home' });
                    }, 2000);


                } else {
                    this.successMessage = '';
                    this.errorMessage = 'Error on Adding New User';
                }
            } else {
                this.successMessage = '';
                this.errorMessage = 'You must fill in all fields';
            }
        },
    },
}
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
}
</style>