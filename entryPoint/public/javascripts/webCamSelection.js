
function toggle(source) {
    console.log("check off all");
    checkboxes = document.getElementsByName('camID');
    for(var i=0, n=checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }
}