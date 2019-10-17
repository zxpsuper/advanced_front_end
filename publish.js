var ghpages = require("gh-pages");
ghpages.publish(
    "./docs/.vuepress/dist",
    {
        branch: "gh-pages",
    },
    function(err) {
        console.log("docs同步完成!");
    }
);
