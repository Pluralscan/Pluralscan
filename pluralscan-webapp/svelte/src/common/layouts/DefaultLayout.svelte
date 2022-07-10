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
        <HeaderNavItem href="#/" text="Home"/>
        <HeaderNavItem href="#/projects" text="Projects"/>
        <HeaderNavItem href="#/packages" text="Packages"/>
        <HeaderNavItem href="#/analyzers" text="Analyzers"/>
        <HeaderNavItem href="#/scans" text="Scans"/>
        <HeaderNavItem href="#/diagnosis" text="Diagnosis"/>
    </HeaderNav>
</Header>

<Content>
    <slot name="content" />
</Content>

<style>
</style>
