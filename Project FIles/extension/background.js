window.onload = () => {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      url = tabs[0].url;
      console.log("url in onload",url)
      const p = document.getElementById("output");
      if (localStorage.getItem("data") && localStorage.getItem("url")==url) {
        text = localStorage.getItem("data");
      } else {
        localStorage.setItem("data","")
        text = "Click summarize!";
      }
      p.innerHTML = text;
    });
  };
  chrome.extension.onConnect.addListener(async function (port) {
    console.log("Connected .....");
    var content = "";
    port.onMessage.addListener(async function (url) {
      if (
        localStorage.getItem("flag") != "1" ||
        localStorage.getItem("url") != url
      ) {
        console.log("inside");
        window.localStorage.setItem("url", "");
      }
      if (
        window.localStorage.getItem("flag") == "1" &&
        window.localStorage.getItem("url") == url
      ) {
        const data = window.localStorage.getItem("data");
        console.log("last session data", data);
      } else {
        window.localStorage.setItem("url", url);
        var res = await fetch(`http://127.0.0.1:5000/summary?url=${url}`);
        var content = await res.text();
        console.log("flag and data set");
        window.localStorage.setItem("flag", 1);
        window.localStorage.setItem("data", content);
        port.postMessage("api call done")
      }
    });
  });