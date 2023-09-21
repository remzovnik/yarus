export default (value: boolean) => {
  document.documentElement.setAttribute("data-modal-active", !value ? "false" : "true");
};
