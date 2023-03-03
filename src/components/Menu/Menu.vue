<template>
    <div class="container">
        <Navbar />

        <div>
            <button type="button" class="btn btn-secondary float-start">
                View/Add Categories
            </button>

            <button type="button" class="btn btn-secondary float-end" v-if="numOfCategories > 0">
                    Add New Items
                </button>
        </div>

        <div class="clearfix"></div>

        <div>
            Is User Logged In? {{ isUserLoggedIn }}
            <br/>
            User Id Is: {{ LoggedInUserId }}
            <br/>
            Num of Categories? {{ numOfCategories }}
            <br />
            Categories Array: {{ listOfCategories }}
            <br />
        </div>

    </div>
</template>

<script>
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
            locationId: "",
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
            this.locationId = this.$route.params.locationId,
            this.displayAllCategories({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
            });
        }
    },
    methods: {
        ...mapMutations([
            "isLoggedInUser",
            "displayAllCategories",
        ]),
        ...mapActions(["redirectTo"]),
    }
}
</script>

<style scoped></style>
