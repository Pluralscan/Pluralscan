<script lang="ts">
	import Router from "svelte-spa-router";
	import Home from "./home/Home.svelte";
	import Analyzers from "./analyzers/Analyzers.svelte";

	const routes = {
		"/": Home,
		"/analyzers": Analyzers,
		"/projects": Projects,
	};
	import "carbon-components-svelte/css/all.css";
	import Projects from "./projects/Projects.svelte";
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
