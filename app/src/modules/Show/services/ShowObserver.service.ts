export class ShowObserverService {
  public readonly options = {
    root: null,
    rootMargin: "0px",
    threshold: [0.9],
  };
  createObserver() {
    const options = {
      root: null,
      rootMargin: "0px",
      // threshold: buildThresholdList(),
    };
    // const observer = new IntersectionObserver(handleIntersect, options);
    // observer.observe(boxElement);
  }
}
