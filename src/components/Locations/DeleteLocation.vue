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
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-warning" v-if="errorMessage.length > 0">
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
            allItemsIdIs: [],
            allCatsIdIs: [],
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

            // All Items in This Location (KFC Restaurant)
            // http://localhost:3000/items?locId=3
            let result = await axios.get(`http://localhost:3000/items?locId=${this.locId}`);
            let resultLength = result.data.length;
            for (var i = 0; i < resultLength; i++) {
                this.allItemsIdIs.push(result.data[i].id);
            }

            // All Categories in This Location (KFC Restaurant)
            // http://localhost:3000/categories?locationId=3
            // write locId or locationId depend on db.json file (database)
            let resultCat = await axios.get(`http://localhost:3000/categories?locationId=${this.locId}`);
            let resultCatLength = resultCat.data.length;
            for (var i = 0; i < resultCatLength; i++) {
                this.allCatsIdIs.push(resultCat.data[i].id);
            }

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

            // For Items
            let allItemsResults = [];
            for (var i = 0; i < this.allItemsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);
                if (result.status == 200) {
                    allItemsResults.push(true);
                } else {
                    allItemsResults.push(false);
                }
            }

            // For Categories
            let allCatsResults = [];
            for (var i = 0; i < this.allCatsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/categories/${this.allCatsIdIs[i]}`);
                if (result.status == 200) {
                    allCatsResults.push(true);
                } else {
                    allCatsResults.push(false);
                }
            }

            // For Location
            let result = await axios.delete(`http://localhost:3000/locations/${this.deleteLocation}`);


            if (result.status == 200 && !allCatsResults.includes(false) && !allItemsResults.includes(false)) {
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

<style></style>