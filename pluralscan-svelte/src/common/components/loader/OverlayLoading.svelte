<script>
    import { fade } from "svelte/transition";
    export let duration;
    export let message = "Loading";
    export let active = false;
</script>

<div transition:fade={{ duration: duration }} class="overlay" style="--loading-visibility: {active ? 'visible': 'hidden'}">
    <div>
        <slot class="loader" />
        <p class="message">{message}</p>
    </div>
</div>

<style lang="scss">
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background: #333333;
        visibility: var(--loading-visibility);
    }

    .overlay :first-child {
        color: white;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        height: 200px;
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
    }


    .message {
        bottom: 0;
        margin-top: 20px;
    }

    // .loader :global(:first-child) {
    //     text-align: center;
    //     left: 50%;
    //     top: 50%;
    //     -webkit-transform: translateX(-50%) translateY(-50%);
    //     transform: translateX(-50%) translateY(-50%);
    // }
</style>
