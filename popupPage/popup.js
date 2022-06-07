chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    var domain = url.hostname;

    if(domain == "arca.live") {
        executeScript();
    } else {
        window.close();
    }
});


function executeScript() {
    $(document).ready(function() {
        $(function() {
            $("#sideBarChannelList").sortable({
                start: function(event, ui) {
                    var start_pos = ui.item.index();
                    ui.item.data("start_pos", start_pos);
                },
                change: function(event, ui) {
                    var start_pos = ui.item.data("start_pos");
                    var index = ui.placeholder.index();
                    if (start_pos < index) {
                        $("#sideBarChannelList li:nth-child("+index+")").addClass("highlights");
                    } else {
                        $("#sideBarChannelList li:eq("+(index+1)+")").addClass("highlights");
                    }
                },
                update: function(event, ui) {
                    $("#sideBarChannelList li").removeClass("highlights");
                    var result = $(this).sortable("serialize", {attribute: "value"});
                    console.log(result);
                },
                handle: ".handle"
            });
        });


        chrome.storage.sync.get("storage_sideBarChannelList", function(data) {
            cList = data.storage_sideBarChannelList
            if(Array.isArray(cList) && cList.length) {
                data.storage_sideBarChannelList.forEach(function(element) {
                    appendChannelDiv(element);
                });
            } else {
                appendChannelDiv("");
            }
        });

        chrome.storage.sync.get("storage_activateScript", function(data) {
            document.getElementById("activateScriptSwitch").checked = data.storage_activateScript;
        });

        chrome.storage.sync.get("storage_recentHumorDisplay", function(data) {
            document.getElementById("recentHumorDisplaySwitch").checked = data.storage_recentHumorDisplay;
        });


        $("#addChannel").click(function() {
            appendChannelDiv("");
        });

        $(document).on("click", ".deleteBtn", function() {
            $(this).parent().remove();
        });

        $("#channelSave").click(function() {
            var channelElements = Array.from(document.getElementById("sideBarChannelList").children);
            var channelIDs = [];

            channelElements.forEach(function(element) {
                cID = element.getElementsByClassName("channelID")[0].value;
                if(cID) {
                    channelIDs.push(cID);
                }
            });

            var activateScript = document.getElementById("activateScriptSwitch").checked;
            var recentHumorDisplay = document.getElementById("recentHumorDisplaySwitch").checked;

            chrome.storage.sync.set({
                storage_activateScript: activateScript,
                storage_recentHumorDisplay: recentHumorDisplay,
                storage_sideBarChannelList: channelIDs
            });
            
            chrome.tabs.reload();
            window.close();
        });
    });

    function appendChannelDiv(channelID) {
        var div = document.createElement("div");
        div.setAttribute("class", "divContainer");
            
        var handle = document.createElement("img");
        handle.setAttribute("src", "/imgs/handle.png");
        handle.setAttribute("class", "handle");

        var deleteBtn = document.createElement("img");
        deleteBtn.setAttribute("src", "/imgs/delete.png");
        deleteBtn.setAttribute("class", "deleteBtn");

        var input = document.createElement("input");
        input.setAttribute("value", channelID);
        input.setAttribute("class", "channelID");

        div.append(handle);
        div.append(input);
        div.append(deleteBtn);

        document.getElementById("sideBarChannelList").append(div);
    }
}
