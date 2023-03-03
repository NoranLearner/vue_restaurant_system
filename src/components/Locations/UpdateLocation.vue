<template>

    <Navbar/>

    <form @click.prevent>
        <h1 class="text-center">Update Restaurant</h1>
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
                <button type="button" class="btn btn-success" @click="updateLocation()">Update Now</button>
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
    name: 'UpdateLocation',
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
            locationId: '',
            successMessage: '',
            errorMessage: '',
        }
    },
    components: {
        Navbar
    },
    mounted() {
        let user = localStorage.getItem("user-info");
        if (!user) {
            this.redirectTo({ val: "sign-up" });
        } else {
            this.userId = JSON.parse(user).id;
            this.locationId = this.$route.params.locationId;
            this.canCurrentUserAccessThisLocation();
        }
    },
    methods: {
        ...mapActions(["redirectTo"]),
        async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`
            http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}
            `);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.state.name = this.locationData[0].name;
                this.state.phone = this.locationData[0].phone;
                this.state.address = this.locationData[0].address;
            } else {
                this.redirectTo({ val: 'home' });
            }
        },
        async updateLocation() {
            // Activate Validation
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log("Form Validated Successfully");
                let result = await axios.put(`http://localhost:3000/locations/${this.locationId}`,
                    {
                        name: this.state.name,
                        phone: this.state.phone,
                        address: this.state.address,
                        userId: this.userId,
                    });
                if (result.status == 200) {
                    // show success message
                    this.errorMessage = '';
                    this.successMessage = 'Updated Location successfully';
                    setTimeout(() => {
                        this.redirectTo({ val: "home" });
                    }, 2000);
                } else {
                    // show error message
                    this.successMessage = '';
                    this.errorMessage = 'Something went wrong, Try Again';
                }
            } else {
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