<template>
    <div class="container">
        <Navbar />

        <div>
            <router-link :to="{ name: 'view-categories', params: { locId: locationId } }">
                <button type="button" class="btn btn-secondary float-start">
                    View/Add Categories
                </button>
            </router-link>

            <router-link :to="{ name: 'add-new-item', params: { locId: locationId } }">
                <button type="button" class="btn btn-secondary float-end" v-if="numOfCategories > 0">
                    Add New Items
                </button>
            </router-link>
        </div>

        <div class="clearfix"></div>

        <div class="text-center">
            <h1 class="mb">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>


        <div class="mb-3" v-if="listOfUserCategories.length>0">
            <router-link :to="{ name: 'delete-all-items', params: { locId: locationId } }">
                <button type="button" class="btn btn-danger">
                    Delete All Items
                </button>
            </router-link>
        </div>

        <div class="each-category">
            <div class="" v-for="(cat, i) in listOfUserCategories" :key="i">
                <div class="row">
                    <div class="catName row col-12">
                        <h5 class="text-center bg-light p-1">{{ cat.name }}</h5>
                    </div>
                    <div :class="{ 'col-xs-12 col-sm-4 px-4': cat.id == item.catId }"
                        v-for="(item, x) in listOfUserItems" :key="x" v-show="cat.id == item.catId">
                        <div :class="{ 'each-item': cat.id == item.catId }" v-if="cat.id == item.catId">
                            <h6 class="item-name">Item: {{ item.name }}</h6>
                            <p class="item-desc text-muted">
                                "Description: {{ item.description }} "
                            </p>
                            <div>
                                <span class="available-items float-start">Available Quantity: {{
                                        numberWithCommas(item.qty)
                                }}</span>
                                <span class="item-price float-end">
                                    Price: {{ numberWithCommas(item.price) }} $
                                </span>
                            </div>
                            <div class="clearfix"></div>
                            <br />
                            <div class="text-white">
                                <router-link :to="{
                                    name: 'update-item',
                                    params: { locationId: locationId, itemId: item.id },
                                }">
                                    <button class="btn btn-success float-start">Update</button>
                                </router-link>
                                <router-link :to="{
                                    name: 'delete-item', 
                                    params: { locationId: locationId, itemId: item.id}}
                                ">
                                    <button class="btn btn-danger float-end">Delete</button>
                                </router-link>
                            </div>
                            <div class="clearfix"></div>
                            <br />
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </div>

        <!-- ---------------------------------------- -->

        <!-- <div>
            Is User Logged In? {{ isUserLoggedIn }}
            <br/>
            User Id Is: {{ LoggedInUserId }}
            <br/>
            Num of Categories? {{ numOfCategories }}
            <br />
            Categories Array: {{ listOfCategories }}
            <br />
        </div> -->

        <!-- ---------------------------------------- -->
        <!-- 
        {{ listOfUserCategories }}

        <hr>

        {{ listOfUserItems }}

        
        -->
        <!-- ---------------------------------------- -->
    </div>
</template>

<script>
// To Use HTTP Request
import axios from "axios";
// For redirect to links
import { mapActions, mapState, mapMutations } from "vuex";
import Navbar from "@/components/Header/Navbar.vue";

export default {
    name: "Menu",
    components: {
        Navbar,
    },
    data() {
        return {
            userId: "",
            userName: "",
            locationId: this.$route.params.locationId,
            locName: "",
            locAddress: "",
            listOfUserCategories: [],
            listOfUserItems: [],
        };
    },
    computed: {
        ...mapState([
            "isUserLoggedIn",
            "LoggedInUserId",
            "numOfCategories",
            "listOfCategories",
        ]),
    },
    async mounted() {
        let user = localStorage.getItem("user-info");
        if (!user) {
            // Using name in router file
            this.redirectTo({ val: "sign-up" });
        } else {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.isLoggedInUser();
            this.displayAllCategories({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
            });
            this.canUserAccessThisLocation({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
                redirectToPage: "home",
            });
            this.getLocationInfo(this.userId, this.locationId);

            this.getCurrentUserCategories(this.userId, this.locationId);

            this.getCurrentUserItems(this.userId, this.locationId);
        }
    },
    methods: {
        ...mapMutations([
            "isLoggedInUser",
            "displayAllCategories",
            "canUserAccessThisLocation",
        ]),
        ...mapActions(["redirectTo"]),
        async getLocationInfo(userId, locId) {
            let result = await axios.get(
                `http://localhost:3000/locations?userId=${userId}&id=${locId}`
            );
            let locDetails = [];
            if (result.status == 200) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },
        async getCurrentUserCategories(userId, locId) {
            let result = await axios.get(
                `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
            );
            if (result.status == 200) {
                this.listOfUserCategories = result.data;
            }
        },
        async getCurrentUserItems(userId, locId) {
            let result = await axios.get(
                `http://localhost:3000/items?userId=${userId}&locId=${locId}`
            );
            if (result.status == 200) {
                this.listOfUserItems = result.data;
            }
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
    },
};
</script>

<style scoped>
.mb {
    margin-bottom: 0;
}

.catName {
    color: teal;
    font-weight: bold;
}

.item-name {
    color: darkgoldenrod;
}

.item-price {
    color: firebrick;
}
</style>