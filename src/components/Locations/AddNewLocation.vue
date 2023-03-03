<template>

    <Navbar/>
    
    <form @click.prevent>
        <h1 class="text-center">Add New Restaurant</h1>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Restaurant Name" v-model="state.name">
                <span class="error-feedback" v-if="v$.name.$error">{{v$.name.$errors[0].$message}}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Restaurant Phone" v-model="state.phone">
                <span class="error-feedback" v-if="v$.phone.$error">{{v$.phone.$errors[0].$message}}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Restaurant Address" v-model="state.address">
                <span class="error-feedback" v-if="v$.address.$error">{{v$.address.$errors[0].$message}}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length>0">
                {{ successMessage }}
            </div>
            <div class="col-auto d-block mx-auto alert alert-danger" v-if="errorMessage.length>0">
                {{ errorMessage }}
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <button type="button" @click="addLocation()" class="btn btn-primary">Add Now</button>
            </div>
        </div>
    </form>

</template>

<script>

import axios from "axios";
// For redirect to links
import { mapActions } from "vuex";
// For validate data
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
// For Composition Api
import { reactive, computed } from "vue";

import Navbar from '@/components/Header/Navbar.vue';


export default {
    name: 'AddNewLocation',
    setup() {
        // Data
        const state = reactive({
            name: '',
            phone: '',
            address: '',
        });
        // Validations
        const rules = computed(() => {
            return {
                name: { required, minLength: minLength(10) },
                phone: { required, minLength: minLength(11) },
                address: { required },
            };
        });
        // Write rules first
        const v$ = useValidate(rules, state);
        return { state, v$ };
    },
    data() {
        return {
            userId: '',
            successMessage: '',
            errorMessage: '',
        }
    },
    components: {
        Navbar,
    },
    mounted() {
        let user = localStorage.getItem("user-info");
        if (!user) {
            this.redirectTo({ val: "sign-up" });
        } else {
            this.userId = JSON.parse(user).id;
        }
    },
    methods: {
        ...mapActions(["redirectTo"]),
        async addLocation() {
            // Activate Validation
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log("Form Validated Successfully");
                let result = await axios.post(`http://localhost:3000/locations`, {
                    name: this.state.name,
                    phone: this.state.phone,
                    address: this.state.address,
                    userId: this.userId,
                });
                if (result.status == 201) {
                    // show success message
                    this.errorMessage = '';
                    this.successMessage = 'Added New Location';
                    this.redirectTo({ val: "home" });
                    setTimeout(() => {
                        this.successMessage = '';
                        this.errorMessage = '';
                        this.state.name = '';
                        this.state.phone = '';
                        this.state.address = '';
                        this.v$.name.$errors[0].$message = '';
                        this.v$.phone.$errors[0].$message = '';
                        this.v$.address.$errors[0].$message = '';
                    }, 2000);
                } else {
                    // show error message
                    this.successMessage = '';
                    this.errorMessage = 'Something went wrong, Try Again';
                }
            } else {
                // console.warn("Form Validation Failed");
                this.successMessage = '';
                this.errorMessage = 'You must fill in all required fields';
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
