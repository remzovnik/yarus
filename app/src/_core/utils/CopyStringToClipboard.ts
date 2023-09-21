export default (text: string): Promise<void> => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "0";
  textArea.style.height = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((resolve, reject) => {
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      reject();
    }
  });
};
