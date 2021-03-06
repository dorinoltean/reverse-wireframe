class Rectangle {
  x = 0
  y = 0
  width = 0
  height = 0
  type = ""
  tagName = ""

  toArr() {
    return [this.x, this.y, this.width, this.height]
  }
  toObject() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type,
      tagName: this.tagName
    }
  }
}

function getElementPosition(el, parentRect) {
  let rect = new Rectangle()

  rect.x = el.x
  rect.y = el.y
  rect.width = el.width
  rect.height = el.height
  rect.type = el.type
  rect.tagName = el.tagName
  return rect
}

function getRectangles(el, rectangles) {
  let parentRect = el.parent ? el.parent.rectangle : null;

  el.rectangle = getElementPosition(el, parentRect)
  rectangles.push(el.rectangle)

  for (let i = 0; i < el.children.length; i++) {
    getRectangles(el.children[i], rectangles)
  }
  return rectangles
}

module.exports = async function (webContents, body) {

  try {
    let rectangles = getRectangles(body, [])
    console.log(rectangles.length)
    rectangles = rectangles.filter(r => r.type == "text" || r.tagName == "img" || r.tagName == "svg").map(r => r.toObject())

    await webContents.executeJavaScript(`drawAbstract(${JSON.stringify(rectangles)})`)
  }
  catch (ex) { console.log(ex) }

}