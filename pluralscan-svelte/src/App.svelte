<script lang="ts">
	import Router from "svelte-spa-router";
	import Home from "./home/Home.svelte";
	import Analyzers from "./analyzers/Analyzers.svelte";
	import Projects from "./projects/Projects.svelte";
	import Packages from "./packages/Packages.svelte";
	import "carbon-components-svelte/css/all.css";
	import '@carbon/ibm-products/css/index.min.css';
	import Scans from "./scans/Scans.svelte";
import ScheduleScan from "./scans/ScheduleScan.svelte";

	const routes = {
		"/": Home,
		"/analyzers": Analyzers,
		"/packages": Packages,
		"/projects": Projects,
		"/scans": Scans,
		"/scans/schedule/packages/:package_id": ScheduleScan,
	};
</script>

<main>
	<Router {routes} />
</main>

<style>
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
