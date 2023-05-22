<template>
  <div class="wallet mt20 br12 svelte-o95zkd">
    <div
      class="grid svelte-q2f2pt"
      style="
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
        min-width: 900px;
        padding: 10px 16px;
      "
    >
      <div class="row svelte-o95zkd" style="">
        <div class="df aic svelte-o95zkd">
          <div class="svelte-o95zkd">
            <div class="df aic fw3 T1 lh18 svelte-o95zkd">
              <span class="svelte-o95zkd">BTC</span>
            </div>
            <div class="f12 T4 lh18 svelte-o95zkd">Bitcoin</div>
          </div>
        </div>

        <div class="svelte-o95zkd">
          <span class="red-box">1 month</span>
        </div>
        <div class="svelte-o95zkd">
          <span class="green-box">3 month</span>
        </div>
        <div class="svelte-o95zkd">
          <span class="green-box">6 month</span>
        </div>
        <div class="svelte-o95zkd">
          <span class="green-box">buy</span>
        </div>
        <div class="df aic svelte-o95zkd">
          <a
            class="cp BLUE btc-deposit svelte-o95zkd"
            href="/assets/deposit?currency=BTC"
            >Deposit</a
          >
          <a
            class="cp ml24 BLUE btc-withdraw svelte-o95zkd"
            href="/assets/withdrawal?currency=BTC"
            >Withdraw</a
          >
          <a
            class="ml24 cp BLUE btc-deposit svelte-o95zkd"
            href="/fiat/buy-crypto/place-order?currency=BTC&amp;side=buy"
            >Buy/Sell</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.wallet.svelte-o95zkd.svelte-o95zkd {
  background: #15172a;
}

.br12 {
  border-radius: 12px;
}
.mt20 {
  margin-top: 20px;
}

.grid.svelte-q2f2pt {
  display: grid;
  max-height: 100%;
  line-height: 42px;
}

.row.svelte-o95zkd.svelte-o95zkd {
  display: contents;
}

.row.svelte-o95zkd > div.svelte-o95zkd {
  padding: 12px 8px;
}
.aic {
  align-items: center;
}

.df {
  display: flex;
}

.coin.svelte-o95zkd.svelte-o95zkd {
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.mr16 {
  margin-right: 16px;
}

body img {
  vertical-align: unset;
}

.fw3 {
  font-weight: 600;
}

.lh18 {
  line-height: 18px;
}

.aic {
  align-items: center;
}

.df {
  display: flex;
}

.T4 {
  color: #9fa3ab;
}

.f12 {
  font-size: 12px;
}

.lh18 {
  line-height: 18px;
}

.row.svelte-o95zkd > div.svelte-o95zkd {
  padding: 12px 8px;
}

.cp {
  cursor: pointer;
}
.BLUE {
  color: white;
}
.ml24 {
  margin-left: 24px;
}

.red-box {
  border: 0.5px solid red;
  padding: 4px 8px;
}

.green-box {
  border: 0.5px solid green;
  padding: 4px 8px;
}
</style>
