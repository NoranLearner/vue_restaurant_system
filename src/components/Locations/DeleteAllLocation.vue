<template>

    <div class="container">

        <Navbar/>

        <form @click.prevent>
        
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <h1>Delete All Locations</h1>
                    <hr>
                    <p class="text-danger">
                        Are you sure you want to delete all locations ?
                    </p>
                    <span class="text-muted">It will also delete all related items and categories...., Be careful</span>
                    <hr>
                </div>
            </div>
        
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger text-white" @click="deleteAll()">Delete All Now</button>
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
    name: 'DeleteAllLocation',
    components: {
        Navbar
    },
    data() {
        return {
            userId: '',
            allLocationId: [],
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

            // All Locations
            // http://localhost:3000/locations?userId=2
            let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
            let resultLength = result.data.length;
            for (var i = 0; i < resultLength; i++) {
                this.allLocationId.push(result.data[i].id);
            }
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        goBack() {
            // redirect to home page
            this.redirectTo({ val: 'home' });
        },
        async deleteAll() {
            // For Location
            // Code of location must in final
            let allResults = [];
            for (var i = 0; i < this.allLocationId.length; i++) {
                let result = await axios.delete(`http://localhost:3000/locations/${this.allLocationId[i]}`);

                if (result.status == 200) {
                    allResults.push(true);
                } else {
                    allResults.push(false);
                }
            }

            if (!allResults.includes(false)) {
                // All deleted successfully
                this.successMessage = 'Delete All Locations Successfully';
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