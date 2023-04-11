var port = chrome.extension.connect({
  name: "Sample Communication",
});
var text = "";
port.onMessage.addListener(function (msg) {
  console.log("message recieved:popup js", msg);
  const p = document.getElementById("output");
  console.log(localStorage.getItem("data"));
  if (localStorage.getItem("data")) {
    text = localStorage.getItem("data");
  } else {
    console.log("wrong");
    text = "Click summarize!";
  }
  p.innerHTML = text;
  btn.disabled = false;
  btn.innerHTML = "Summarise";
});
const btn = document.getElementById("summarise");
var url = ""
btn.addEventListener("click", function () {
  btn.disabled = true;
  btn.innerHTML = "Summarising...";
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    url = tabs[0].url;
    port.postMessage(url);
  });
});

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