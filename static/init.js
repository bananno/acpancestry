
const ORIGIN = (() => {
  let url = window.location.href;

  if (url.match('\\?')) {
    return url.slice(0, url.indexOf('\\?'));
  }

  return url;
})();

console.log(ORIGIN);
