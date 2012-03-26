doctype 5
html ->
  head ->
    meta charset: "utf-8"
    title "MVC-SANDBOX"
    script src: "core.js", type: "text/javascript"
    script src: "mvc.js", type: "text/javascript"
    script src: "index.js", type: "text/javascript"
    link rel: "stylesheet", href: "index.css"
  body ->
    div '#container-absolute', ->
      div '#toolbar.autoload', data: class: 'Toolbar'
      div '#sidebar.autoload', data: class: 'Sidebar'
      div '#content-view.autoload', data: class: 'ContentView'