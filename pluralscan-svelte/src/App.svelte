<script lang="ts">
  import "carbon-components-svelte/css/all.css";
  import Router from "svelte-spa-router";
  import Analyzers from "./analyzers/Analyzers.svelte";
  import Home from "./home/Home.svelte";
  import Packages from "./packages/Packages.svelte";
  import Projects from "./projects/Projects.svelte";
  import ScanDetails from "./scans/ScanDetails.svelte";
  import Scans from "./scans/Scans.svelte";
  import ScheduleScan from "./scans/ScheduleScan.svelte";

  const routes = {
    "/": Home,
    "/analyzers": Analyzers,
    "/packages": Packages,
    "/projects": Projects,
    "/scans": Scans,
    "/scans/:scan_id": ScanDetails,
    "/scans/schedule/packages/:package_id": ScheduleScan,
  };
</script>

<main>
  <Router {routes} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
