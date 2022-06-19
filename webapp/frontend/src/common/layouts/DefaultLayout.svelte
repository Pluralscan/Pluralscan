<script>
    import {
        Header,
        HeaderNav,
        HeaderNavItem,
        SkipToContent,
        Content,
    } from "carbon-components-svelte";
    import Fade from "carbon-icons-svelte/lib/Fade.svelte";
</script>

<Header company="CleanSecPy" platformName="Web Platform">
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
    <HeaderNav>
        <HeaderNavItem href="/" text="Home"/>
        <HeaderNavItem href="#/analyzers" text="Analyzers"/>
    </HeaderNav>
</Header>

<Content>
    <slot name="content" />
</Content>

<style>
</style>
