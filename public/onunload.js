var addUnload = () => {
  window.addEventListener("beforeunload", function(e) {
    e.preventDefault();
    e.returnValue = "";
  });
  window.removeEventListener("click", addUnload);
};
window.addEventListener("click", addUnload);
