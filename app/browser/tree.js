function getTree() {
  var range = document.createRange();

  function getTextNode(el, textElement) {
    range.selectNode(textElement);
    let boundingClientRects = range.getBoundingClientRect()
    Object.assign(el, {
      tagName: "",
      type: "text"
    })

    if (boundingClientRects) {
      Object.assign(el,
        {
          width: boundingClientRects.width,
          height: boundingClientRects.height,
          x: boundingClientRects.x,
          y: boundingClientRects.y,
        })
    }
  }

  function getPropsAndChildren(el, htmlElement) {
    htmlElement.leaf = el

    Object.assign(el, {
      tagName: String(htmlElement.tagName).toLowerCase(),
      type: "htmlElement"
    })

    let boundingClientRects = htmlElement.getBoundingClientRect()
    if (boundingClientRects) {
      Object.assign(el,
        {
          width: boundingClientRects.width,
          height: boundingClientRects.height,
          x: boundingClientRects.x,
          y: boundingClientRects.y,
        })
    }

    for (let i = 0; i < htmlElement.children.length; i++) {
      let childHtmlElement = htmlElement.children[i]
      let child = { children: [], parent: el }
      el.children.push(child)
      getPropsAndChildren(child, childHtmlElement)
    }

    for (let i = 0; i < htmlElement.childNodes.length; i++) {
      let childNode = htmlElement.childNodes[i]
      if (childNode.nodeName == "#text") {
        let child = { children: [], parent: el }
        el.children.push(child)
        getTextNode(child, childNode)
      }
    }
  }

  let body = { children: [], parent: null }
  let htmlBody = document.querySelector("body")

  getPropsAndChildren(body, htmlBody)
  range.detach();
  return body
}

module.exports = async function (webContents) {
  return await webContents.executeJavaScript(String(getTree) + " getTree()")
}
