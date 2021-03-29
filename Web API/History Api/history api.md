## History API

### 介绍

- DOM [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 对象通过 [`history`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/history) 对象提供了对浏览器的会话历史的访问(不要与 [WebExtensions history](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history)搞混了)。它暴露了很多有用的方法和属性。

- 从 HTML5 开始——提供了对 history 栈中内容的进行操作的 API；
- 由于安全原因，浏览器不允许脚本读取历史记录的地址，但是允许在地址之间导航。

### 查看当前窗口(tab)历史记录栈长度

历史记录栈类型：

1. 当前窗口历史记录栈
   - `由window.history管理`
   - `window.history.length`可查看当前窗口历史记录栈长度。
2. 全局历史记录栈
   - chrome 中通过`ctrl+h`打开

### 前进、后退、跳到指定位置

```js
// 在history中向后跳转，效果等同于用户点击浏览器回退按钮。
window.history.back()
// 向前跳转，效果等同于用户点击了前进按钮。
window.history.forward()
// 向后移动一个页面 (等同于调用 back())
window.history.go(-1)
// 向前移动一个页面, 等同于调用了 forward()
window.history.go(1)
```

类似地，你可以传递参数值2并向前移动2个页面，等等。

- ### `window.history.go(0)`

  - 作用等同于刷新
  - `go(0)` vs `reload`的区别
    - `reload`会重新拉取数据，`go(0)`直接从缓存中获取数据。

### 添加和修改历史记录中的条目

- HTML5引入了 [history.pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 和 [history.replaceState()](https://developer.mozilla.org/en-US/docs/Web/API/History_API#the_replacestate()_method) 方法，它们分别可以添加和修改历史记录条目。这些方法通常与[`window.onpopstate`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowEventHandlers/onpopstate) 配合使用。

- 参数：`pushState`、`replaceState`支持传入 3 个参数，依次为`stateObj`、`title`、`url`。

  1. 状态对象（stateObj）：就是一个JavaScript普通对象。

     - 状态对象可以是能被序列化的任何东西。原因在于Firefox将状态对象保存在用户的磁盘上，以便在用户重启浏览器时使用，我们规定了状态对象在序列化表示后有640k的大小限制。如果你给 `pushState()` 方法传了一个序列化后大于640k的状态对象，该方法会抛出异常。如果你需要更大的空间，建议使用 `sessionStorage` 以及 `localStorage`。

     - 每次，当用户路由到对应历史记录条目，则可以通过`history.state`或者`popstate`事件获取到对应的`stateObj`

       ```js
       // 获取当前历史记录的状态对象
       history.state
       // 通过popstate事件获取stateObj
       window.onpopstate = e => {
         console.log(e.state)
       }
       ```

  2. 标题（title)：一个可省略的标题，建议即使不用时，也传递个空字符串。

  3. URL：新的历史 URL 记录

     - **必须是同域 url**
     - 可以是相对 url，也可以是绝对 url。

     ```js
     // 当前页面地址www.abc.com/foo/bar.html
     // 相对路径
     history.pushState({ test: 1 }, 'test1', './test.html') // 页面地址变为www.abc.com/foo/test1.html
     // 绝对路径
     history.pushState({ test2: 2 }, 'test2', '/test2.html') // 页面地址变为www.abc.com/test2.html
     // 非同域
     history.pushState({ test3: 3 }, 'test3', 'http://www.baidu.com') // 跨域，报错。
     ```

     - 该参数是可选的，缺省为当前URL。

     注意：

     - **使用 pushState、replaceState 定义新的历史URL记录时，不会立即加载这个URL，甚至都不会检查新的历史记录地址是否真的存在**。

       它仅仅是在**当前历史记录栈中**新增了一条记录，并不会立即加载相应页面。这样就实现了**不刷新页面改变 URL**。

       只在刷新或是先跳转到了其他域页面，再返回的场景下，才会触发加载页面，否则都是无刷新的。

     - **pushState()、replaceState() 不会触发 hashchange 事件，即使新的 URL 与旧的 URL 仅哈希不同也是如此。**

### pushState、replaceState 和改变 hash 来实现无刷新改变 URL 的区别

- 前者可以修改同源下的任意路径。后者**只能修改 hash 部分**。
- 前者即使**在添加的 `url` 跟之前完全相同时**，也会被添加到历史记录栈中，并会触发 `popstate` 事件；后者**只有在新 hash 不同时**，才会添加新的历史记录，并触发`hashchange`，否则无法触发`hashchange`。
- 前者支持关联任意的数据到历史记录项上；后者只能把相关数据转成字符串添加到 hash 上，变相绑定相关数据。

### popstate 事件

#### 介绍

每当处于激活状态的历史记录条目发生变化时，会触发`popstate`事件。

更准确的定义：每当**同一个文档**或者叫**当前文档**的浏览历史（即 `history` 对象）出现变化时，就会触发 `popstate` 事件。当历史记录变化，引**起文档变化(reload)(比如当前文档刷新或者加载了另一个文档)时，popstate 不会触发**。

`A popstate event is dispatched to the window each time the active history entry changes between two history entries for the same document.`

翻译：当同一个文档的两个历史记录条目发生变化时，popstate事件就会被发送到窗口。

#### 触发场景

- 调用`pushState、replaceState`时，**不会触发`popstate`事件**。
- 只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用`History.back()、History.forward()、History.go()`方法导致历史记录条目变化时才会触发。
- 该事件只针对同一个文档，如果浏览历史的切换，**导致加载不同的文档，该事件不会触发**。
- **当网页加载时,各浏览器对`popstate事件`是否触发有不同的表现,`Chrome` 和 `Safari`会触发`popstate`事件, 而`Firefox`不会.（有待验证）**。
- `hash`改变时，也会触发`popstate事件`。

注意：

- 如果当前处于激活状态的历史记录条目是由`history.pushState()方法`创建，或者由`history.replaceState()方法`修改过的, 则`popstate事件对象的state属性包含了当前这个历史记录条目的state对象的一个拷贝`。

demo

```html
<body>
	<header class="header">History API</header>
	<section>
		<div class="state__item" onclick="pushStateWithPage1()">pushStateWithpage1</div>
		<div class="state__item" onclick="goProxyPage()">goProxyPage</div>
		<div class="state__item" onclick="pushStateWithPage2()">pushStateWithpage2</div>
		<div class="state__item" onclick="replaceStateWithPage3()">replaceStateWithPage3</div>
		<div class="state__item" onclick="back()">back</div>
         <div class="state__item" onclick="back()">back</div>
		<div class="state__item" onclick="go2()">go2</div>
		<div class="state__item" onclick="goGoogle()">goGoogle</div>
	</section>
	<script>
		// 绑定事件处理函数.
		window.onpopstate = function (event) {
			alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
		}
		function pushStateWithPage1() {
			// 添加并激活一个历史记录条目 http://example.com/example.html?page=1,条目索引为1
			history.pushState({ page: 1 }, 'title 1', '?page=1')
		}
		function goProxyPage() {
             // 添加并激活一个历史记录条目 http://example.com/proxy.html
			history.pushState({ page: 'proxy' }, 'proxy page', './proxy.html')
		}
		function pushStateWithPage2() {
			// 添加并激活一个历史记录条目 http://example.com/example.html?page=2,条目索引为2
			history.pushState({ page: 2 }, 'title 2', '?page=2')
		}
		function replaceStateWithPage3() {
			// 修改当前激活的历史记录条目 http://ex..?page=2 变为 http://ex..?page=3,条目索引为3
			history.replaceState({ page: 3 }, 'title 3', '?page=3')
		}
		function back() {
			// 弹出 "location: http://127.0.0.1:5500/proxy.html, state: {"page":"proxy"}"
			history.back()
		}
        function back() {
			// 弹出 "location: http://127.0.0.1:5500/example.html?page=1, state: {"page":1}"
			history.back()
		}
		function go2() {
			// 弹出 "location: http://127.0.0.1:5500/proxy.html?page=3, state: {"page":3}"
			history.go(2)
		}
		function goGoogle() {
             // 跳转到 http://www.google.com
			window.location = 'http://www.google.com'
		}
	</script>
</body>
```

不明白的运行demo自己多点几下就明白了。

