<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">
                    <h1>Delete Category #{{ catId }}</h1>
                    <h4>Category Name: {{ name }}</h4>
                    <hr>
                    <p class="text-danger">
                        Are you sure you want to delete this category ?
                    </p>
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger text-white" @click="deleteCategory()">Delete Now</button>
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
import { mapActions, mapMutations } from "vuex";
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'DeleteCategory',
    components: {
        Navbar
    },
    data() {
        return {
            locId: this.$route.params.locationId,
            catId: this.$route.params.catId,
            userId: '',
            name: "",
            allItemsIdIs: [],
            successMessage: '',
            errorMessage: '',
            // locationData: '',
        }
    },
    async mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            this.redirectTo({ val: 'sign-up' });
        } else {

            // this.deleteLocation = this.$route.params.locationId;
            this.userId = JSON.parse(user).id;

            // this.canCurrentUserAccessThisLocation();

            this.canUserAccessThisCategory({
                userIdIs: this.userId,
                locationIdIs: this.locId,
                catIdIs: this.catId,
                redirectToPage: "home",
            });

            this.getCategoryName(this.userId, this.locId, this.catId);

            // category name: Break
            // http://localhost:3000/items?catId=5
            let result = await axios.get(`http://localhost:3000/items?catId=${this.catId}`);
            let resultLength = result.data.length;
            for (var i = 0; i < resultLength; i++) {
                this.allItemsIdIs.push(result.data[i].id);
            }
        }
    },
    methods: {

        ...mapMutations([
            "canUserAccessThisCategory",
        ]),

        ...mapActions(['redirectTo']),

        goBack() {
            // redirect to view-categories page
            this.$router.push({ name: "view-categories", params: { locationId: this.locId } });
        },

        /* async canCurrentUserAccessThisLocation() {
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
        }, */

        async getCategoryName(userId, locId, catId) {
            let result = await axios.get(`
            http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}
            `);
            if (result.status == 200) {
                this.categoryNames = result.data;
                if (this.categoryNames.length > 0) {
                    this.name = this.categoryNames[0].name;
                }
            }
        },

        async deleteCategory() {
            let result = await axios.delete(`http://localhost:3000/categories/${this.catId}`);
            let allResults = [];
            for (var i = 0; i < this.allItemsIdIs.length; i++){
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);
                if (result.status == 200) {
                    allResults.push(true);
                } else {
                    allResults.push(false);
                }
            }
            if (result.status == 200 && !allResults.includes(false)) {
                this.successMessage = 'Delete Category and Related Items Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "view-categories", params: { locationId: this.locId } });
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