const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy('docs/assets');
  eleventyConfig.addPassthroughCopy('docs/dist');

  return {
    dir: {
      input: 'docs',
      layouts: '_layouts',
      output: '_site'
    },
  };
};
