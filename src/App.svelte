<script lang="ts">
  import { Api } from "./lib/api.js";
  import VersionsComponent from './lib/Versions.svelte';

  type Versions = Record<string, { from: number; to: number; }>;


  let wsUrl = 'wss://ws-quartz.unique.network';
  let api: Api = null;

  let from = 0;
  let to = 0;

  let processing = false;

  let callsCount = 0;

  let versions: Versions = {};

  const onConnect = async () => {
    if (!api) {
      api = await Api.create(wsUrl);
      from = 1;
      to = await api.getLastBlock();
    } else {
      api = null;
      from = 0;
      to = 0;
    }

    versions = {};
  };

  const onStart = async () => {
    const fromNum = parseInt(from.toString(), 10);
    const toNum = parseInt(to.toString(), 10);

    if (Number.isNaN(fromNum) || Number.isNaN(toNum) || fromNum > toNum) {
      console.warn(`Wrong numbers`);

      return;
    }

    versions = {};
    processing = true;
    callsCount = 0;

    await getVersionRanges(fromNum, toNum);

    processing = false;
  }

  function updateVersions (version: string, blockNumber: number): void {
    if (!versions[version]) {
      versions[version] = { from: blockNumber, to: blockNumber };

      return;
    }

    if (versions[version].from > blockNumber) {
      versions[version].from = blockNumber;
    }

    if (versions[version].to < blockNumber) {
      versions[version].to = blockNumber;
    }
  }

  async function getVersionRanges(from: number, to: number): Promise<void> {
    const [fromVersion, toVersion] = await Promise.all([
      await api.getVersionAt(from),
      await api.getVersionAt(to),
    ]);

    callsCount = api.calls;

    updateVersions(fromVersion, from);
    updateVersions(toVersion, to);

    if (fromVersion === toVersion) return;
    if (to - from <= 1) return;

    const middle = Math.floor((to + from) / 2);

    await Promise.all([
      getVersionRanges(from, middle),
      getVersionRanges(middle, to)
    ]);
  }
</script>

<main>

  <input bind:value={wsUrl} disabled='{api}' placeholder="enter ws url">
  <button on:click={onConnect}>{ api ? 'Disconnect' : 'Connect'}</button>

  {#if api}
    <div>
      <label>
        From
        <input bind:value={from} placeholder="from">
      </label>

      <label>
        To
        <input bind:value={to} placeholder="to">
      </label>
    </div>

    <button on:click={onStart} disabled={processing}>{processing ? 'Processing' : 'Start'}</button>

    <p>Called RPC {callsCount} times</p>
  {/if}

  <VersionsComponent versions={versions} />

</main>

<style>

</style>