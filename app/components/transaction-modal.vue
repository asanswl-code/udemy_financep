<template>
    <UModal>
        <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="ADD"> </UButton>

        <template #content>
            <UForm :state="state" :schema="schema" ref="form" @sumbmit.prevent="save">
                <UCard>
                    <template #header> Add Transaction </template>
                    <UFormField label="Transaction Type" name="type" h class="mb-2" required>
                        <USelect placeholder="Select the transaction tpye" :items="types" class="w-full" v-model="state.type"></USelect>
                    </UFormField>
                    <UFormField label="Amount" name="amount" required class="mb-2">
                        <UInput type="number" placeholder="Amount" class="w-full" v-model="state.amount"></UInput>
                    </UFormField>
                    <UFormField label="Transaction date" name="created_at" required class="mb-2">
                        <UInput type="date" icon="heroicons:calendar-date-range-20-solid" class="w-full" v-model="state.created_at"></UInput>
                    </UFormField>
                    <UFormField label="Description" name="description" hint="optional" class="mb-2">
                        <UInput placeholder="description" class="w-full" v-model="state.description"></UInput>
                    </UFormField>
                    <UFormField label="Category" name="category" h class="mb-2" required v-if="state.type === 'Expense'">
                        <USelect placeholder="categories" :items="categories" class="w-full" v-model="state.category"></USelect>
                    </UFormField>
                    <UButton type="submit" color="secondary" variant="solid" label="Save"></UButton>
                </UCard>
            </UForm>
        </template>
    </UModal>
</template>

<script lang="ts" setup>
import { categories, types } from "~/utils/constants";
import * as z from "zod";

const defaultschema = z.object({
    created_at: z.string(),
    decription: z.string().optional(),
    amount: z.number().positive("0보다 커야합니다."),
});

const incomeSchema = z.object({
    type: z.literal("Income"),
});
const expenseSchema = z.object({
    type: z.literal("Expense"),
    category: z.enum(categories),
});
const investmentSchema = z.object({
    type: z.literal("Investment"),
});
const savingSchema = z.object({
    type: z.literal("Saving"),
});

const schema = z.discriminatedUnion("type", [incomeSchema, expenseSchema, investmentSchema, savingSchema]).and(defaultschema);

const form = ref();

const save = async () => {
    form.value.validate();
};

const state = ref({
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: "",
    category: undefined,
});
</script>

<style></style>
