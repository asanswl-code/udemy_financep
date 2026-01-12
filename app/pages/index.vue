<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelectMenu :items="transactionViewOptions" v-model="selectedView" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="5000" :loading="isLoading" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="isLoading" />
    </section>

    <section class="flex justify-between mb-10">
        <div>
            <div class="text-2xl font-extrabold">Transactions</div>
            <div class="text-gray-500">You have {{ incomeCount }} Incomes and {{ expenseCount }} expenses this period</div>
        </div>
        <div>
            <TransactionModal />
        </div>
    </section>

    <section v-if="!isLoading">
        <div v-for="(transactionsOnDay, date) in transactionsGroupedbyDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" @deleted="refreshTransactions" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2 v-for=" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
const supabase = useSupabaseClient();
const selectedView = ref(transactionViewOptions[1]);
const isLoading = ref(false);
const isOpen = ref(false);

// 1. 데이터 페칭 (Key: 'transactions')
const { data: asyncData, refresh } = await useAsyncData("transactions", async () => {
    const { data, error } = await supabase.from("transactions").select();
    if (error) return [];
    return data;
});

// 2. transactions를 asyncData와 동기화 (computed로 만들면 관리가 훨씬 쉽습니다)
const transactions = computed(() => asyncData.value ?? []);

// 3. Income / Expense 필터링 (반드시 return을 하거나 중괄호를 뺍니다)
const income = computed(() => transactions.value.filter((t) => t.type === "Income"));
const expense = computed(() => transactions.value.filter((t) => t.type === "Expense"));

// 4. 합계 계산 (오타 수정 및 안전장치 추가)
const incomeTotal = computed(() => income.value.reduce((sum, transaction) => sum + (transaction.amount || 0), 0));
const expenseTotal = computed(() => expense.value.reduce((sum, transaction) => sum + (transaction.amount || 0), 0));

const incomeCount = computed(() => income.value.length);
const expenseCount = computed(() => expense.value.length);

// 5. 새로고침 함수
const refreshTransactions = async () => {
    isLoading.value = true;
    try {
        await refresh();
    } finally {
        isLoading.value = false;
    }
};

// 6. 날짜별 그룹화 로직
const transactionsGroupedbyDate = computed(() => {
    const groups = {};
    transactions.value.forEach((transaction) => {
        const date = new Date(transaction.created_at).toISOString().split("T")[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
    });
    return groups;
});
</script>
<style>
@reference "D:\coding\udemy\financep\app\assets\css\main.css";
</style>
