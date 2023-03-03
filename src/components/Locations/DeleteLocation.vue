<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <h1>Delete Restaurant #{{ deleteLocation }}</h1>
                    <hr>
                    <p class="text-danger">
                        Are you sure you want to delete this location ?
                    </p>
                    {{ name }}
                    <br>
                    {{ phone }}
                    <br>
                    {{ address }}
                    <hr>
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger text-white" @click="deleteRestaurant()">Delete Now</button>
                </div>
            </div>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length>0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-warning" v-if="errorMessage.length>0">
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
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'DeleteLocation',
    components: {
        Navbar
    },
    data() {
        return {
            name: '',
            phone: '',
            address: '',
            userId: '',
            deleteLocation: '',
            locationData: '',
            successMessage: '',
            errorMessage: '',
        }
    },
    async mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            this.redirectTo({ val: 'sign-up' });
        } else {
            this.deleteLocation = this.$route.params.locationId;
            this.userId = JSON.parse(user).id;
            this.canCurrentUserAccessThisLocation();
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        goBack() {
            // redirect to home page
            this.redirectTo({ val: 'home' });
        },
        async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`
            http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}
            `);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.name = this.locationData[0].name;
                this.phone = this.locationData[0].phone;
                this.address = this.locationData[0].address;
            } else {
                this.redirectTo({ val: 'home' });
            }
        },
        async deleteRestaurant() {
            // For Location
            let result = await axios.delete(`http://localhost:3000/locations/${this.deleteLocation}`);

            if (result.status == 200) {
                this.successMessage = 'Delete Location Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.redirectTo({ val: 'home' });
                }, 2000);
            } else {
                this.successMessage = '';
                this.errorMessage = 'Something went wrong, Try again';
            }
        },
    },
}
</script>

<style>

</style>