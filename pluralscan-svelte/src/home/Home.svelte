<script lang="ts">
  import {
    Button,
    Column,
    Grid,
    Row,
    TextInput,
    Tile,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { RestClient } from "../../libs/pluralscan-api/RestClient";
  import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
  import { extractProjectSource } from "../../libs/pluralscan-api/utils";
  import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
  import Wave from "../common/components/loader/Wave.svelte";
  import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
  import { delay, getErrorMessage } from "../utils";
  import { push } from "svelte-spa-router";
  import { projectStore } from "../store/ProjectStore";
  import { packageStore } from "../store/PackageStore";

  const API_OPTIONS = new RestClientOptions(process.env.API_URI);
  const searchData = {
    uri: "",
  };
  let state = {
    analyzers: [],
    project: null,
    package: null,
  };
  let loadingMessage = "Loading...";
  let isLoading = false;
  let errorMessage = "";
  let hasError = false;

  async function search_project() {
    const restClient = new RestClient(API_OPTIONS);
    loadingMessage =
      "Verify if project is already registred in Pluralscan repository...";
    isLoading = true;
    hasError = false;
    await delay(1000);

    try {
      const projectNameAndSource = extractProjectSource(searchData.uri);
      const project = await restClient.project.findProject(
        projectNameAndSource.name,
        projectNameAndSource.source
      );

      if (!project) {
        loadingMessage = "No project found, try to create a new one...";
        await delay(1000);
        const createProjectResponse = await restClient.project.createProject(
          searchData.uri
        );
        console.log(createProjectResponse);
        loadingMessage = "Project synchronized with new snapshot package...";
        state.project = createProjectResponse.project;
        state.package = createProjectResponse.package;
        await delay(1000);
      } else {
        state.project = project;
        loadingMessage = "Create a package snapshot from project sources...";
        const latestSnapshot = await restClient.package.latestSnapshot(
          state.project["id"]
        );
        console.log(latestSnapshot);
        state.package = latestSnapshot;
        await delay(2000);
      }

      loadingMessage = "Snapshot is ready !";
      projectStore.pagination.set({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 0,
        itemCount: 0,
      });

      packageStore.pagination.set({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 0,
        itemCount: 0,
      });
      await delay(2000);
      push("/scans/schedule/packages/" + state.package["id"]);
    } catch (error) {
      errorMessage = error;
      hasError = true;
      reportError({ message: getErrorMessage(error) });
    } finally {
      isLoading = false;
    }
  }
</script>

<DefaultLayout showError={hasError} {errorMessage}>
  <div slot="content">
    <OverlayLoading duration="400" message={loadingMessage} active={isLoading}>
      <Wave />
    </OverlayLoading>

    <Grid>
      <Row>
        <h1>Pluralscan</h1>
      </Row>

      <Row>
        <Column noGutter padding>
          <Tile class="repo-input-tile">
            <h5>Search for an open-source projet or package to analize</h5>
            <Row>
              <Column>
                <TextInput
                  light
                  labelText="Source"
                  helperText="Exemple: https://github.com/gromatluidgi/Cast.RestClient"
                  placeholder="Enter project or package url...."
                  bind:value={searchData.uri} />
              </Column>
            </Row>
            <Button on:click={search_project} class="load-repo-button"
              >Search</Button>
          </Tile>
        </Column>
      </Row>
    </Grid>
  </div>
</DefaultLayout>

<style lang="scss">
  h5 {
    margin-bottom: var(--cds-spacing-05);
  }

  :global(.load-repo-button) {
    margin-top: var(--cds-spacing-05) !important;
  }
</style>
