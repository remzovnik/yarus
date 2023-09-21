export default () => {
  const origin = console.error;
  console.error = (error) => {
    if (/Failed to fetch dynamically imported module/.test(error.message)) {
      window.location = window.location.href as Location | (string & Location);
    } else {
      origin(error);
    }
  };
};
