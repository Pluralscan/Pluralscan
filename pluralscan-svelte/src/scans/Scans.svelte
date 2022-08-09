<script lang="ts">
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { RestClient } from "../../libs/pluralscan-api/RestClient";
  import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
  import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
  import Wave from "../common/components/loader/Wave.svelte";
  import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
  import { scanStore } from "../store/ScanStore";
  import ScanList from "./components/ScanList.svelte";

  const apiOptions = new RestClientOptions(process.env.API_URI);
  const apiClient = new RestClient(apiOptions);
  const { scans, currentPage, pagination } = scanStore;

  let loading = false;

  onMount(async () => {
    if ($currentPage.itemCount == 0) {
      await fetchPackages($currentPage.pageIndex, $currentPage.pageSize);
    }
  });

  async function fetchPackages(pageIndex, pageSize) {
    loading = true;

    const response = await apiClient.scan.list(pageIndex, pageSize);
    // Sync backend pagination index with front
    response.searchMetadata.pageIndex += 1;
    scans.set(response.scans);
    pagination.set(response.searchMetadata);

    loading = false;
  }

  function onPageChange(event) {
    const paginationInfo = event.detail;
    if (paginationInfo && paginationInfo.pageSize && paginationInfo.page) {
      fetchPackages(paginationInfo.page - 1, paginationInfo.pageSize);
    }
  }
</script>

<DefaultLayout>
  <div slot="content">
    <OverlayLoading duration="400" active={loading}>
      <Wave />
    </OverlayLoading>
    <Grid fullWidth>
      <Row>
        <h1>Scans</h1>
      </Row>
      <Row padding>
        <Column noGutter>
          <ScanList
            pageNumber={$currentPage.pageIndex}
            pageSize={$currentPage.pageSize}
            scans={$scans}
            totalItems={$currentPage.itemCount}
            {onPageChange} />
        </Column>
      </Row>
    </Grid>
  </div>
</DefaultLayout>
