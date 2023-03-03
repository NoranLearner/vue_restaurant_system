<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">

                    <div class="text-center">
                        <h1 class="mb0">{{ locName }}</h1>
                        <p class="text-muted">{{ locAddress }}</p>
                    </div>

                    <hr>

                    <p class="text-danger">
                        Are you sure you want to delete this item ?
                    </p>

                    <h4> {{ itemName }} </h4>

                </div>
            </div>

            <br/>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <router-link :to="{ name: 'menu', params: { locationId: locId } }">
                        <button type="button" class="btn btn-secondary">Back To Menu</button>
                    </router-link>
                    &nbsp;
                    <button class="btn btn-danger text-white" @click="deleteItem()">Delete Now</button>
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
import { mapActions, mapMutations } from "vuex";
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'DeleteItem',
    components: {
        Navbar
    },
    data() {
        return {
            locId: this.$route.params.locationId,
            itemId: this.$route.params.itemId,
            userId: '',
            locationData: '',
            locName: "",
            locAddress: "",
            itemName: "",
            itemPrice: "",
            itemsQty: 1,
            description: "",
            pickedCategory: "",
            successMessage: '',
            errorMessage: '',
        }
    },
    async mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            this.redirectTo({ val: 'sign-up' });
        } else {

            this.userId = JSON.parse(user).id;

            this.canCurrentUserAccessThisLocation();

            this.canUserAccessThisItem({
                userIdIs: this.userId,
                locationIdIs: this.locId,
                itemIdIs: this.itemId,
                redirectToPage: "home",
            });

            this.getItemInfo(this.userId, this.locId, this.itemId);

        }
    },
    methods: {

        ...mapMutations(["canUserAccessThisItem"]),
        ...mapActions(['redirectTo']),

        async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`
            http://localhost:3000/locations?id=${this.locId}&userId=${this.userId}
            `);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.locName = this.locationData[0].name;
                this.locAddress = this.locationData[0].address;
            } else {
                this.redirectTo({ val: 'home' });
            }
        },

        async getItemInfo(userId, locId, itemId) {
            let result = await axios.get(`
                http://localhost:3000/items?userId=${userId}&locId=${locId}&id=${itemId}
            `);
            let itemDetails = result.data[0];
            if (result.status == 200) {
                this.itemName = itemDetails.name;
                this.itemPrice = itemDetails.price;
                this.itemsQty = itemDetails.qty;
                this.description = itemDetails.description;
                this.pickedCategory = itemDetails.catId;
            }
        },

        async deleteItem() {
            let result = await axios.delete(`http://localhost:3000/items/${this.itemId}`);

            if (result.status == 200) {
                this.successMessage = 'Item is deleted Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "menu", params: { locationId: this.locId } });
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
.mb0 {
    margin-bottom: 0;
}
</style>