<template>
    <main class="main-content">
        <slot />
    </main>
</template>

<style scoped lang="scss">
.main-content {
    min-height: 100vh;
    margin-left: 264px;
    padding: 32px;
}

@media (max-width: 900px) {
    .main-content {
        margin-left: 0;
        padding: 20px;
    }
}
</style>
