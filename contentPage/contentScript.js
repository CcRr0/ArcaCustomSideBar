chrome.storage.sync.get("storage_activateScript", function(data) {
    if(data.storage_activateScript) {
        executeScript();
    }
});


function executeScript() {
    $(document).ready(function() {
        $("#newsRank").remove();
        $(".sticky-container").remove();

        chrome.storage.sync.get("storage_recentHumorDisplay", function(data) {
            if(!data.storage_recentHumorDisplay) {
                $("#recentHumor").remove();
                $("#recentLive").remove();
            }
        });

        document.getElementById("recentChannelHeadline").classList.add("recentChannelHeadlineContainer");

        var currentChannelID = $(document).find("[data-channel-name]").attr("href").split("/").pop();

        chrome.storage.sync.get("storage_sideBarChannelList", function(data) {
            cList = data.storage_sideBarChannelList
            if(cList.length) {
                cList.forEach(function(element, index) {
                    var div = document.createElement("div");
                    div.setAttribute("cindex", index);
                    div.setAttribute("class", "recentChannelHeadlineContainer");

                    var appendToThis = Array.from(document.getElementsByClassName("recentChannelHeadlineContainer")).pop();
                    appendToThis.parentNode.insertBefore(div, appendToThis.nextSibling);
                });

                cList.forEach(function(element, index) {
                    var get = $.get("https://arca.live/b/"+element, function(data) {
                        var channelID = $(data).find("[data-channel-name]").attr("href").split("/").pop();
                        if(channelID == currentChannelID) {
                            return;
                        }

                        var channelName = $(data).find("[data-channel-name]").attr("data-channel-name");
                        var recentChannelHeadline = $(data).find("#recentChannelHeadline");
                        recentChannelHeadline.find(".item-title").find("a").text(channelName+"의 개념글");

                        $("div").find("[cindex="+index+"]").append(recentChannelHeadline);
                    });
                });
            }
        });
    });
}
