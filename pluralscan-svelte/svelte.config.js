const sveltePreprocess = require('svelte-preprocess');

const preprocessOptions = {
    sourceMap: true, // "you would always want sourcemaps for the IDE" – dummdidumm
    // defaults: {
    //     script: "typescript",
    //     style: "scss",
    // },
    // scss:{
    //     includePaths: ['src/**/*.css', 'src/**/*.scss','src/**/*.svelte'],
    // },
    // postcss: {
    //     plugins: [require("tailwindcss"), require('autoprefixer')()]
    // }
};

module.exports = {
    preprocess: sveltePreprocess(preprocessOptions),

    // Export this to allow rollup.config.js to inherit the same preprocess options.
    preprocessOptions,
}