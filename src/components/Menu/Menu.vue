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
    }
}
</script>

<style scoped>
.mb {
    margin-bottom: 0;
}</style>
