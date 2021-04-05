### 粘贴事件和剪切板

当用户在浏览器用户界面发起“粘贴”操作时，会触发**`paste`**事件。

事件处理程序可以通过调用事件的 `clipboardData` 属性上的 [`getData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer/getData)访问剪贴板内容。

要覆盖默认行为（例如，插入一些不同的数据或转换剪贴板的内容），事件处理程序必须使用 [`event.preventDefault()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)，取消默认操作，然后手动插入想要的数据。

```js
document.addEventListener('paste', event => {
   const clipboardData = event.clipboardData
   const clipboardDataItems = clipboardData && clipboardData.items
   console.log('clipboardData:', clipboardData)
})
```

![](./images/1.png)

- 粘贴事件触发时，可以从event里获取到clipboardData。
- ClipboardEvent.clipboardData：一个 DataTransfer 对象，它包含了由用户发起的 cut、copy和paste操作影响的数据， 以及它的 MIME 类型。
- **ClipboardEvent.clipboardData**属性保存了一个 [`DataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer) 对象，这个对象可用于：
  - 描述哪些数据可以由 `cut` 和 `copy` 事件处理器放入剪切板，通常通过调用 [`setData(format, data)`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer/setData) 方法；
  - 获取由 `paste` 事件处理器拷贝进剪切板的数据，通常通过调用 [`getData(format)`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer/getData) 方法。

***疑问***：既然是粘贴，那就可以粘贴纯文本、html、图片等，那要如何区分本次粘贴的内容是哪种类型/格式的呢？

答1：利用`event.clipboardData.types`可获取类型数组，里面存储着此次粘贴内容的类型。比如：

```js
document.addEventListener('paste', event => {
   const clipboardData = event.clipboardData
   console.log('clipboardData.types:', clipboardData.types)
})
```

1. `Ctrl + c`复制一段纯文本，然后粘贴，触发paste事件，控制台打印出`clipboardData.types: ["text/plain"]`。

   ![](./images/2.png)

2. `Ctrl + c`复制一段html文本（暂可理解为网站中带标签或带样式的文本），然后粘贴，触发paste事件，控制台打印出`clipboardData.types: (2) ["text/plain", "text/html"]`。

   ![](./images/3.png)

   **注意**：粘贴html文本会打印出两个类型（text/plain, text/html）。

3. 用截图工具截图+复制，然后粘贴，触发paste事件，控制台打印出`clipboardData.types: ["Files"]`。

   ![](./images/4-add.png)

   此时可通过`event.clipboardData.files[0]`拿到剪切板中图片的file对象。

   ![](./images/4-add2.png)

   （也可通过另一种方法拿到file对象，下面会讲到。）

   **注意**：直接去复制系统里的图片是没有用的。

   ![](./images/4.png)

   虽然答1中所说的通过`event.clipboardData.files[0]`可判断类型，但我一般不用这个，而是用答2的方法。

答2：利用`event.clipboardData.items`判断此次粘贴内容的类型。

![](./images/5.png)

- ` DataTransferItemList` 对象是一组代表被拖动项的[`DataTransferItem`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransferItem) 对象的**列表**（这是一个Html Drag and Drop API）。
- 列表中的每一项存储着相应信息，因此需要遍历每一项。

```js
document.addEventListener('paste', event => {
   const clipboardData = event.clipboardData
   const clipboardDataItems = clipboardData && clipboardData.items
   console.log('clipboardDataItems:', clipboardDataItems)
})
```

1. `Ctrl + c`复制一段纯文本，然后粘贴，触发paste事件，控制台打印如下：

   ![](./images/6.png)

   但是这样压根儿看不到什么有用的信息，` DataTransferItemList` 未展开时，能看出里面有两项DataTransferItem，但一展开啥都没有了，length也变成0了。这里需要我们去手动遍历每一项：

   ```js
   pasteBox.addEventListener('paste', event => {
       const clipboardData = event.clipboardData
       const clipboardDataItems = clipboardData && clipboardData.items
       console.log('clipboardData:', clipboardData)
       console.log('clipboardDataItems:', clipboardDataItems)
       // 检索剪切板items
       for (var i = 0; i < clipboardDataItems.length; i++) {
          console.log('clipboardDataItems-item:', clipboardDataItems[i])
       }
   })
   ```

   ![](./images/7.png)

   从这里可以看到DataTransferItem 中有两个属性，`kind`和`type`。这个type属性便可以帮我们判断粘贴内容的类型。

2. `Ctrl + c`复制一段html文本（暂可理解为网站中带标签或带样式的文本），然后粘贴，触发paste事件，控制台打印出：

   ![](./images/8.png)

   这里说明一下，为什么会有这种html文本。其实我们到某网站复制一段文本，基本上都会将这段文本原本在原网站中具有的样式和标签都复制过来，导致我们粘贴到输入框中的文本是带有原网站样式的文本。

   如果是想获得纯文本，可通过`DataTransfer.getData(format)`获取

   - **`DataTransfer.getData()`** 方法接受指定类型的拖放（以[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)的形式）数据。如果拖放行为没有操作任何数据，会返回一个空字符串。

   ```js
   pasteBox.addEventListener('paste', event => {
       // 要覆盖默认行为（例如，插入一些不同的数据或转换剪贴板的内容），事件处理程序必须使用 event.preventDefault()，取消默认操作，然后手动插入想要的数据。
       event.preventDefault() // 阻止默认的粘贴事件
       const text = (e.clipboardData || window.clipboardData).getData('text')
       // 这里拿到的text就是纯文本了
   })
   ```

   

3. 用截图工具截图+复制，然后粘贴，触发paste事件，控制台打印出：

   ![](./images/9.png)

   注意：这里获取到被粘贴内容的type的值为`image/png`，说明是图片。

   而答1中粘贴图片通过`event.clipboardData.types`获取到的值是`Files`，`Files`不一定能说明被粘贴的内容就是图片，比如粘贴excel的时候也会打印出`Files`（`["text/plain", "text/html", "text/rtf", "Files"]`）。

   这里介绍另一种获取粘贴图片file对象的方式：

   ```js
   pasteBox.addEventListener('paste', event => {
       const clipboardData = e.clipboardData
       const clipboardDataItems = clipboardData && clipboardData.items
   
       let file = null
       // 检索剪切板clipboardDataItems
       for (var i = 0; i < clipboardDataItems.length; i++) {
           console.log('clipboardDataItems-item-type:', clipboardDataItems[i].type)
           if (clipboardDataItems[i].type.indexOf('image') === -1) return
           file = clipboardDataItems[i].getAsFile()
           break
      }
      // 通过这种方式也能拿到被粘贴图片的file对象
      console.log('file:', file)
      // 两种方法都能拿到图片的file对象
      // console.log('clipboardData.files:', clipboardData.files[0])
   })
   ```


## 说说copy与剪切板

**copy**：当用户通过浏览器UI（例如，使用 Ctrl/⌘+C 键盘快捷方式或从菜单中选择“复制”）启动复制操作并响应允许的[`document.execCommand('copy')`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)调用时触发`copy`事件。

- Target：`Element`：获得焦点的元素（如[`contentEditable`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/contentEditable)内容能编辑或者可以选中的元素），或`body`。

- 调用[`setData(format, data)`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer/setData)可以修改[`ClipboardEvent.clipboardData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent/clipboardData)事件的默认行为：

  ```js
  document.addEventListener('copy', function(e){
      e.clipboardData.setData('text/plain', 'Hello, world!');
      e.clipboardData.setData('text/html', '<b>Hello, world!</b>');
      e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
  });
  ```

- 不能使用[`clipboardData.getData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer/getData)在事件处理函数中获取剪切板数据。

事件的默认行为与事件的来源和事件处理函数相关：

- [synthetic](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) copy事件没有默认行为，除非：
- 如果默认事件没有取消，就复制到选区（如果有选中内容）到剪切板；
- 如果取消了默认事件，但是调用了`setData()`方法：就复制`clipboardData`的内容到到剪切板；
- 如果取消了默认行为，而且没有调用`setData()`方法，就没有任何行为。

基于剪切板JS API可以做的事情不仅仅是粘贴，复制的时候也可以做些事情，例如，我可以在我的网站页面上绑定一个`copy`事件，当你复制文章内容的时候，自动在剪切板文字后面加上一段版权声明。

```js
document.addEventListener('copy', function (event) {
    var clipboardData = event.clipboardData || window.clipboardData;
    var text = window.getSelection().toString();
    if (text) {
        event.preventDefault();
        clipboardData.setData('text/plain', text + '\n\n某某某版权所有');
    }
});
```



**声明：此笔记部分内容摘抄自张鑫旭的博客和MDN，仅作学习笔记所用。**

