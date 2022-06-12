<script lang="ts">
	import Router from "svelte-spa-router";
	import QuickScan from "./analyzers/QuickScan.svelte";
	import Dashboard from "./dashboard/Dashboard.svelte";
	import Projects from "./projects/Projects.svelte";

	const routes = {
		"/": Dashboard,
		"/dashboard": Dashboard,
		"/projects": Projects,
		"/quick-scan": QuickScan,
	};
	import "carbon-components-svelte/css/all.css";
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
