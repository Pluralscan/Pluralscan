<script>
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
    Content,
    Modal,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "carbon-components-svelte";
  import { fly } from "svelte/transition";

  import { location, push } from "svelte-spa-router";

  export let showError = false;
  export let errorTitle = "Something wrong occurs";
  export let errorMessage = "";
</script>

<Header company="Pluralscan" platformName="Web Platform">
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem text="Home" on:click={() => push("/")} />
    <HeaderNavItem on:click={() => push("#/projects")} text="Projects" />
    <HeaderNavItem href="#/packages" text="Packages" />
    <HeaderNavItem href="#/analyzers" text="Analyzers" />
    <HeaderNavItem href="#/scans" text="Scans" />
  </HeaderNav>
</Header>

<Content>
  <div
    in:fly={{ y: -50, duration: 250, delay: 500 }}
    out:fly={{ y: -50, duration: 500 }}>
    <slot name="content" />
  </div>
</Content>

<ComposedModal
  open={showError}
  danger={true}
  preventCloseOnClickOutside={true}
  on:click:button--primary={() => {
    showError = false;
  }}>
  <ModalHeader label="Error" title={errorTitle} />
  <ModalBody>
    <p>{errorMessage}</p>
  </ModalBody>
  <ModalFooter primaryButtonText="Close" />
</ComposedModal>
