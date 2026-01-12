<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 text-gray-500 font-bold">
        <div class="flex items-center justify-between">
            {{ date }}
        </div>
        <div class="flex items-center justify-end mr-10">{{ currency }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    date: String,
    transactions: Array,
});

const sum = computed(() => {
    let sum = 0;

    for (const transaction of props.transactions) {
        if (transaction.type === "Income") {
            sum += transaction.amount;
        } else {
            sum -= transaction.amount;
        }
    }
    return sum;
});
const { currency } = useCurrency(sum);
</script>

<style></style>
