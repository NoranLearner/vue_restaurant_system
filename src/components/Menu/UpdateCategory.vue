<template>
    <div class="container">
        <Navbar />
        <router-link :to="{name: 'view-categories', params:{locId:locationId}}">
            <button type="button" class="btn btn-light">Back To Category</button>
        </router-link>
        &nbsp;
        <router-link :to="{name: 'menu', params:{locId:locationId}}">
            <button type="button" class="btn btn-light">Back To Menu</button>
        </router-link>
        <br />
        <div class="text-center">
            <h1 class="mb">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>
        <!-- --------------------------------------------------------- -->
        <form @click.prevent>
            <h1 class="text-center">Update Category</h1>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Category Name" v-model="name">
                    <span class="error-feedback" v-if="v$.name.$error">{{v$.name.$errors[0].$message}}</span>
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
                    <button type="button" @click="updateCategory()" class="btn btn-success">Update Now</button>
                </div>
            </div>
        </form>
        <!-- --------------------------------------------------------- -->
    </div>
</template>

<script>

// To Use HTTP Request
import axios from "axios";
// For redirect to links
import { mapActions, mapMutations } from "vuex";
// For validate data
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'UpdateCategory',
    components: {
        Navbar
    },
    data() {
        return {
            v$: useValidate(),
            locId: this.$route.params.locationId,
            catId: this.$route.params.catId,
            userId: "",
            locName: "",
            locAddress: "",
            name: "",
            successMessage: "",
            errorMessage: "",
            listOfUserCategories: [],
            categoryName:[],
        }
    },
    validations() {
        return {
            name: { required, minLength: minLength(3), maxLength: maxLength(15)},
        }
    },
    mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            // Using name in router file
            this.redirectTo({ val: 'sign-up' });
        } else {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.canUserAccessThisLocation({
                userIdIs: this.userId,
                locationIdIs: this.locId,
                redirectToPage: "home",
            });
            this.canUserAccessThisCategory({
                userIdIs: this.userId,
                locationIdIs: this.locId,
                catIdIs: this.catId,
                redirectToPage: "home",
            });
            this.getLocationInfo(this.userId, this.locId);
            this.displayUserCategories(this.userId, this.locId);
            this.getCategoryName(this.userId, this.locId, this.catId);
        }
    },
    methods: {
        ...mapMutations([
            "isLoggedInUser",
            "displayAllCategories",
            "canUserAccessThisLocation",
            "canUserAccessThisCategory",
        ]),
        ...mapActions(['redirectTo']),
        async getLocationInfo(userId, locId) {
            let result = await axios.get(`http://localhost:3000/locations?userId=${userId}&id=${locId}`);
            let locDetails = [];
            if (result.status == 200) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },
        async displayUserCategories(userId, locId) {
            let result = await axios.get(`http://localhost:3000/categories?userId=${userId}&locationId=${locId}`);
            if (result.status == 200) {
                this.listOfUserCategories = result.data;
            }
        },
        async getCategoryName(userId,locId,catId) {
            let result = await axios.get(`
            http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}
            `);
            if (result.status == 200) {
                this.categoryNames = result.data;
                if (this.categoryNames.length>0) {
                    this.name = this.categoryNames[0].name;
                }
            }
        },
        async updateCategory() {

            // Activate Validation
            this.v$.$validate();

            if (!this.v$.$error) { 

                let filterCategoryName = this.listOfUserCategories.filter(
                    (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
                );

                if (filterCategoryName.length > 0) {
                    this.errorMessage = 'Category Name already exists, Try Another Name';
                    this.successMessage = '';
                } else {

                    let result = await axios.put(`http://localhost:3000/categories/${this.catId}`, {
                        name: this.name,
                        userId: this.userId,
                        locationId: parseInt(this.locId),
                    });
                    if (result.status == 200) {
                        this.errorMessage = '';
                        this.successMessage = 'Update Category Name Successfully';
                        setTimeout(() => {
                            this.$router.push({ name: "view-categories", params: { locationId: this.locId } });
                        }, 2000);
                    } else {
                        this.successMessage = '';
                        this.errorMessage = 'Something went wrong, Try Again';
                    }

                }

            } else {
                this.successMessage = '';
                this.errorMessage = 'You must fill in category name';
            }
        },
    },
}
</script>

<style scoped>
.mb {
    margin-bottom: 0;
}

.error-feedback {
    color: red;
    font-size: 0.85em;
}
</style>