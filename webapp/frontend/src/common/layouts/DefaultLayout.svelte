<script>
    import {
        Header,
        HeaderNav,
        HeaderNavItem,
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavMenuItem,
        SideNavLink,
        SideNavDivider,
        SkipToContent,
        Content,
    } from "carbon-components-svelte";
    import Fade from "carbon-icons-svelte/lib/Fade.svelte";

    let isSideNavOpen = false;
</script>

<Header company="CleanSecPy" platformName="Web Platform">
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
    <HeaderNav>
        <HeaderNavItem href="#/quick-scan" text="Quick Scan"/>
    </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
        <SideNavLink
            icon={Fade}
            text="Dashboard"
            href="#/dashboard"
            isSelected
        />
        <SideNavLink icon={Fade} text="Projects" href="#/projects" />
        <SideNavLink icon={Fade} text="Link 3" href="/" />
        <SideNavMenu icon={Fade} text="Menu">
            <SideNavMenuItem href="/" text="Link 1" />
            <SideNavMenuItem href="/" text="Link 2" />
            <SideNavMenuItem href="/" text="Link 3" />
        </SideNavMenu>
        <SideNavDivider />
        <SideNavLink icon={Fade} text="Link 4" href="/" />
    </SideNavItems>
</SideNav>

<Content>
    <slot name="content" />
</Content>

<style>
</style>
