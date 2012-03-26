$ ->
  console.log 'hello'
  
# class App extends mvc.Application
#   @cid: 'app'
# 
#   imports:
#     toolbar: 'toolbar'
#     sidebar: 'sidebar'
#     content: 'content-view'
# 
#   events:
#     'search-block show': 'search select'
# 
#   setup:
#     'ad-list-controller':   [ 'AdListCtr', {} ]
#     'search-controller':    [ 'SearchCtr', {} ]
#     'new-ad-controller':    [ 'ModalCtr', {modal: 'new-ad-modal', button: 'new-ad-button'} ]
#     'pref-controller':      [ 'ModalCtr', {modal: 'pref-modal', button: 'pref-button'} ]
#     'followers-controller': [ 'ModalCtr', {modal: 'followers-modal', button: 'followers-button'}]
# 
#   constructor: (options = {}) ->
#     super
#     
#   on_domLoad: ->
#     super
#   