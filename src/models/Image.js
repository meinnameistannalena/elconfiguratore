class Image {
  constructor(src, height = 200, width = 200) {
    this.height = height;
    this.width = width;
    this._src = src;
  }

  get src() {
    return "/static/" + this._src;
  }

  set src(value) {
    this._src = value;
  }
}
export default Image;
