<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 text-gray-900">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="iconColor" />

                <div>{{ transaction.description }}</div>
            </div>
            <UBadge color="primary" variant="outline" v-if="transaction.category">{{ transaction.category }}</UBadge>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdownMenu :items="items" :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }">
                    <UButton color="neutral" variant="ghost" icon="heroicons:ellipsis-horizontal-20-solid" :loading="isLoading"></UButton>
                </UDropdownMenu>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    transaction: Object,
});
const emit = defineEmits(["deleted"]);


const isIncome = computed(() => {
    return props.transaction.type === "Income";
});
const icon = computed(() => {
    return isIncome.value ? "heroicons:arrow-up-right" : "heroicons:arrow-down-left";
});
const iconColor = computed(() => {
    return isIncome.value ? "text-green-600" : "text-red-600";
});

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const toast = useToast();
const supabase = useSupabaseClient();

const deleteTransaction = async () => {
    isLoading.value = true;

    try {
        await supabase.from("transactions").delete().eq("id", props.transaction.id);
        toast.add({
            title: "transaction deleted",
            icon: "i-heroicons-check-circle",
            color: "success",
        });
        emit("deleted", props.transaction.id);
    } catch (error) {
        toast.add({
            title: "transaction deleted",
            icon: "i-heroicons-exclamation-circle",
            color: "red",
        });
    } finally {
        isLoading.value = false;
    }
};

const items = [
    {
        label: "Edit",
        icon: "heroicons:pencil-square",
        onClick: () => {
            console.log("Edit clicked");
        },
    },
    {
        label: "Delete",
        icon: "heroicons:trash",
        color: "error",
        onClick: deleteTransaction,
    },
];
</script>

<style></style>
