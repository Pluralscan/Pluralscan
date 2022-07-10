<script lang="ts">
	import Router from "svelte-spa-router";
	import Home from "./home/Home.svelte";
	import Analyzers from "./analyzers/Analyzers.svelte";
	import Projects from "./projects/Projects.svelte";
	import Packages from "./packages/Packages.svelte";
	import "carbon-components-svelte/css/all.css";
	import Scans from "./scans/Scans.svelte";
	import Diagnosis from "./diagnosis/Diagnosis.svelte";

	const routes = {
		"/": Home,
		"/analyzers": Analyzers,
		"/packages": Packages,
		"/projects": Projects,
		"/scans": Scans,
		"/diagnosis": Diagnosis,
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
