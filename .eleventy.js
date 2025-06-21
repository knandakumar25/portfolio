module.exports = function (eleventyConfig) {
    return {
        pathPrefix: "/portfolio/",
        templateFormats: ["html", "njk"],
        htmlTemplateEngine: "njk"
    };
};