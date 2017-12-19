class Image {
  constructor(src) {
    this._src = src;
    this.marked=false;
  }

  get src() {
    return "/static/" + this._src;
  }

  set src(value) {
    this._src = value;
  }

}
export default Image;
