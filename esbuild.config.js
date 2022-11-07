module.exports = (serverless) => ({
    plugins: [],
    external: ["pg-native"],
    minify: true,
    target: "node16",
    keepOutputDirectory: true
});
