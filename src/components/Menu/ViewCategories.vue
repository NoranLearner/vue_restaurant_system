<template>
    <div class="container">
        <Navbar></Navbar>
        <router-link :to="{name: 'add-new-category', params:{locId:locationId}}">
            <button type="button" class="btn btn-secondary">Add Category</button>
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

        <!-- ---------------------------------------- -->

        <table class="table caption-top" v-if="numOfCategories>0">
            <caption>
                <span>
                    List Of Categories ({{ numOfCategories }})
                </span>
                <span class="float-end">
                    <router-link :to="{name: 'delete-all-categories', params:{locationId:locId}}">
                        <button class="btn btn-danger text-white">Delete All Categories</button>
                    </router-link>
                </span>
            </caption>
            <thead class="table-light">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cat, i) in listOfCategories" :key="i">
                    <th scope="row">{{ cat.name }}</th>
                    <td>
                        <router-link :to="{name: 'update-category', params: {catId: cat.id, locationId:cat.locationId}}">
                            <button class="btn btn-success text-white">Update</button>
                        </router-link>
                        &nbsp;
                        <router-link :to="{name: 'delete-category', params: {catId: cat.id, locationId:cat.locationId}}">
                            <button class="btn btn-danger text-white">Delete</button>
                        </router-link>
                        &nbsp;
                    </td>
                </tr>
            </tbody>
        </table>

        <div role="alert" class="alert alert-warning mt15" v-else>
            No Categories Added Yet
        </div>

        <!-- ---------------------------------------- -->

    </div>
</template>

<script>

// To Use HTTP Request
import axios from "axios";
// For redirect to links
import { mapActions, mapState, mapMutations } from "vuex";
import Navbar from '@/components/Header/Navbar.vue';

export default {
    name: 'ViewCategories',
    components: {
        Navbar
    },
    data() {
        return {
            locId: this.$route.params.locationId,
            userId: "",
            locName: "",
            locAddress: "",
        }
    },
    computed: {
        ...mapState([
            "numOfCategories",
            "listOfCategories"
        ]),
    },
    mounted() {
        let user = localStorage.getItem('user-info');
        if (!user) {
            // Using name in router file
            this.redirectTo({ val: 'sign-up' });
        } else {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.displayAllCategories({
                userIdIs: this.userId,
                locationIdIs: this.locId
            });
            this.canUserAccessThisLocation({
                userIdIs: this.userId,
                locationIdIs: this.locId,
                redirectToPage: "home",
            });
            this.getLocationInfo(this.userId, this.locId);
        }
    },
    methods: {
        ...mapMutations([
            "isLoggedInUser",
            "displayAllCategories",
            "canUserAccessThisLocation"
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
    },
}
</script>

<style scoped>
.mb {
    margin-bottom: 0;
}
.mt15 {
    margin-top: 15px;
}
</style>