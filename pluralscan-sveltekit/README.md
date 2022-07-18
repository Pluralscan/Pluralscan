# Pluralscan Svelte Kit

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Important aspects

- Error and exception handling:
  - A good error handling mechanism prevents the application from breaking when there is an unhandled exception
  - Errors can be easily logged to a server to track down the causes in case of production application
  - Can perform the alternate operations such as displaying an alternate UI showing some sophisticated messages instead of breaking the application
  - Helps in improving the user experience.



## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
