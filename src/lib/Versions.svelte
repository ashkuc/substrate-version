<script lang="ts">
  import { beforeUpdate } from "svelte";

  type Versions = Record<string, { from: number; to: number; }>;

  export let versions: Versions;

  beforeUpdate(() => {
    console.log('update');
    console.log(JSON.stringify(versions));
  });

  $: scanned = Object.values(versions).reduce((acc, { from, to }) => {
    return acc + ( to - from + 1);
  }, 0);

  $: last = Math.max(...Object.values(versions).map(({ to }) => to), 0);
  $: percent = Math.floor((scanned / last) * 100) || 0;

  $: versionsSorted = Object.entries(versions).sort((a, b) => {
    return a[1].from - b[1].from;
  });

  const getLink = (block) => `https://polkadot.js.org/apps/?rpc=wss://ws-quartz.unique.network#/explorer/query/${block}`;
</script>

{#if scanned > 0}
  <p>Scanned: {scanned} of {last} ({percent}%)</p>
  <ul>
    {#each versionsSorted as [version, { from, to }]}
      <li>{version}: {from} - {to} <a href={getLink(from)} target="_blank">open block</a></li>
    {/each}
  </ul>
{/if}


<style>
  li {
    text-align: left;
  }
</style>