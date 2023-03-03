<template>

    <div class="container">

        <Navbar />

        <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
            <button type="button" class="btn btn-secondary float-start">Back To Menu</button>
        </router-link>

        <div class="clearfix"></div>

        <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>

        <hr />

        <!-- ------------------------------------- -->

        <form @click.prevent>
            <h1 class="text-center">Update Item</h1>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- https://getbootstrap.com/docs/5.0/forms/floating-labels/ -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemName.$error }">
                        <input type="text" class="form-control w300" id="floatingItemName" placeholder="Enter Item Name"
                            v-model.trim="itemName">
                        <label for="floatingItemName">Enter Item Name</label>
                        <span class="error-feedback" v-if="v$.itemName.$error">{{ v$.itemName.$errors[0].$message
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemPrice.$error }">
                        <input type="number" class="form-control w300" id="floatingItemPrice"
                            placeholder="Enter Item Price" v-model.trim="itemPrice">
                        <label for="floatingItemPrice">Enter Item Price</label>
                        <span class="error-feedback" v-if="v$.itemPrice.$error">{{
                                v$.itemPrice.$errors[0].$message
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemsQty.$error }">
                        <input type="number" class="form-control w300" id="floatingItemQty"
                            placeholder="Enter Item Quantities" v-model.trim="itemsQty">
                        <label for="floatingItemQty">Enter Item Quantities</label>
                        <span class="error-feedback" v-if="v$.itemsQty.$error">{{
                                v$.itemsQty.$errors[0].$message
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.description.$error }">
                        <textarea class="form-control w300 h150" placeholder="Enter Item Description"
                            id="floatingItemDesc" v-model.trim="description"></textarea>
                        <label for="floatingItemDesc">Enter Item Description</label>
                        <span class="error-feedback" v-if="v$.description.$error">{{
                                v$.description.$errors[0].$message
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating" :class="{ 'form-group--error': v$.pickedCategory.$error }">
                        <select class="form-select w300" id="floatingSelectCat" v-model.trim="pickedCategory">
                            <!-- listOfCategories From mapstate  -->
                            <option v-for="(cat, i) in listOfCategories" :key="i" :value="cat.id">{{ cat.name }}
                            </option>
                        </select>
                        <label for="floatingSelectCat">Select Category Name</label>
                        <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
                                v$.pickedCategory.$errors[0].$message
                        }}</span>
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
            <br />
            <div class="row g-3 align-items-center mb-3">
                <div class="col-auto d-block mx-auto">
                    <button type="button" @click="updateItem()" class="btn btn-success w300">Update Now</button>
                </div>
            </div>
        </form>

        <!-- ------------------------------------- -->

    </div>

</template>

<script>

// To Use HTTP Request
import axios from "axios";
// For redirect to links
import { mapActions, mapState, mapMutations } from "vuex";
// For validate data
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'UpdateItem',
    components: {
        Navbar
    },
    data() {
        return {
            v$: useValidate(),
            userId: "",
            userName: "",
            locationId: this.$route.params.locationId,
            itemId: this.$route.params.itemId,
            locName: "",
            locAddress: "",
            itemName: "",
            itemPrice: "",
            itemsQty: 1,
            description: "",
            pickedCategory: "",
            successMessage: "",
            errorMessage: "",
        }
    },
    validations() {
        return {
            itemName: { required, minLength: minLength(6) },
            itemPrice: { required, between: between(0, 1000000) },
            itemsQty: { required, between: between(1, 100000) },
            description: { required, minLength: minLength(6), maxLength: maxLength(120) },
            pickedCategory: { required },
        }
    },
    computed: {
        ...mapState([
            "isUserLoggedIn",
            "LoggedInUserId",
            "numOfCategories",
            "listOfCategories"
        ]),
    },
    async mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            // Using name in router file
            this.redirectTo({ val: 'sign-up' });
        } else {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.isLoggedInUser();
            this.displayAllCategories({
                userIdIs: this.userId,
                locationIdIs: this.locationId
            });
            this.canUserAccessThisItem({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
                itemIdIs: this.itemId,
                redirectToPage: "home",
            });
            this.canUserAccessThisLocation({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
                redirectToPage: "home",
            });
            this.getItemInfo(this.userId, this.locationId, this.itemId);
            this.getLocationInfo(this.userId, this.locationId);
        }
    },
    methods: {
        ...mapMutations([
            "isLoggedInUser",
            "displayAllCategories",
            "canUserAccessThisItem",
            "canUserAccessThisLocation",
        ]),
        ...mapActions(['redirectTo']),
        async getItemInfo(userId, locId, itemId) {
            let result = await axios.get(`
                http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}
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
        async getLocationInfo(userId, locId) {
            let result = await axios.get(`http://localhost:3000/locations?userId=${userId}&id=${locId}`);
            let locDetails = [];
            if (result.status == 200) {
                locDetails = result.data;
                if (locDetails.length > 0) {
                    this.locName = locDetails[0].name;
                    this.locAddress = locDetails[0].address;
                }
            }
        },
        async updateItem() {

            // Activate Validation
            this.v$.$validate();

            if (!this.v$.$error) {

                // http://localhost:3000/items/1
                let result = await axios.put(`http://localhost:3000/items/${this.itemId}`, {
                    name: this.itemName,
                    // "17.00"
                    price: parseFloat(this.itemPrice).toFixed(2),
                    qty: parseInt(this.itemsQty),
                    description: this.description,
                    catId: this.pickedCategory,
                    locId: parseInt(this.locationId),
                    userId: this.userId,
                });

                if (result.status == 200) {

                    this.errorMessage = '';
                    this.successMessage = 'Item updated successfully';

                    setTimeout(() => {
                        this.$router.push({ name: "menu", params: { locationId: this.locationId } });
                    }, 2000);

                } else {
                    this.successMessage = '';
                    this.errorMessage = 'Something went wrong, Try Again';
                }
            }

            else {
                this.successMessage = '';
                this.errorMessage = 'You must fill in all required fields';
            }

        },
    },

}
</script>

<style scoped>
.mb0 {
    margin-bottom: 0;
}

.w300 {
    min-width: 300px;
}

.h150 {
    min-height: 150px;
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