<script>
    import {
        Header,
        HeaderNav,
        HeaderNavItem,
        SkipToContent,
        Content,
    } from "carbon-components-svelte";
</script>

<Header company="Pluralscan" platformName="Web Platform">
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
    <HeaderNav>
        <HeaderNavItem href="/" text="Home"/>
        <HeaderNavItem href="#/projects" text="Projects"/>
        <HeaderNavItem href="#/analyzers" text="Analyzers"/>
    </HeaderNav>
</Header>

<Content>
    <slot name="content" />
</Content>

<style>
</style>
