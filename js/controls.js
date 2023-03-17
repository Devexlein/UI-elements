const htmlRange = document.getElementById('font-size-control');
const htmlResult = document.getElementById('percent');
const contentRange = document.getElementById('content-size-control');
const contentResult = document.getElementById('contentResult');
const sidebarRange = document.getElementById('sidebar-size-control');
const sidebarResult = document.getElementById('sidebarResult');
const root = document.querySelector('HTML');
const cont = document.querySelector('.content');
const side = document.querySelector('.sidebar');

htmlRange.addEventListener("input", function () {
   htmlResult.innerHTML = htmlRange.value + "%";
   root.style.fontSize = htmlRange.value + "%";
}, false);

contentRange.addEventListener("input", function () {
   contentResult.innerHTML = contentRange.value + "rem";
   cont.style.setProperty('--fs', contentRange.value + 'rem');
}, false);

sidebarRange.addEventListener("input", function () {
   sidebarResult.innerHTML = sidebarRange.value + "rem";
   side.style.setProperty('--fs', sidebarRange.value + 'rem');
}, false); 
