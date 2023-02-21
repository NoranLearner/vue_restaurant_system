<template>
    <form @click.prevent>
        <h1>Sign Up</h1>
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
                <button type="submit" class="btn btn-secondary" @click="signUpNow()">Sign Up Now</button>
                &nbsp;
                <!-- <button type="button" class="btn btn-link" @click="loginPage()">Login</button> -->
                <button type="button" class="btn btn-link" @click="redirectTo({val: 'login'})">Login</button>
            </div>
        </div>
    </form>
</template>

<script>
import { mapActions } from 'vuex';
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
    name: "SignUpForm",
    data() {
        return {
            v$: useValidate(),
            name: "",
            email: "",
            password:"",
        }
    },
    validations() {
        return {
            name: {required, minLength: minLength(10)},
            email: {required, email},
            password: { required, minLength: minLength(10) },
        }
    },
    methods: {
        /* loginPage(){
            // Use name in router file
            this.$router.push({name:'login'});
        }, */
        ...mapActions(['redirectTo']),
        signUpNow() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log('Form Validated Successfully');
            } else {
                console.log('Form Validation Failed');
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.error-feedback{
    color: red;
    font-size: 0.85em;
    }
</style>