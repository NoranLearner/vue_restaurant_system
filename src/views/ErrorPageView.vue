<template>
    <div>
        <img src="@/assets/PageNotFound.jpg" class="rounded mx-auto d-block h450">
        <div class="text-center m-4">
            <router-link :to="{ name: 'home' }">
                <button class="btn btn-secondary" type="button">Visit Home Page</button>
            </router-link>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ErrorPageView',
}
</script>

<style scoped>
.h400{
    height: 450px;
}
</style>