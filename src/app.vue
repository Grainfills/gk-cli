<template>
    <div class="root">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<style>
    html, body, .root {
        background: #F6F6F6;
        height: 100%;
    }
</style>