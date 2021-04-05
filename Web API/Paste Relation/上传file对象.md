## 如何上传file对象？

实际开发，我们可以借助FormData对象进行上传。

这里我们复制一张截图然后在paste事件中取到图片的file对象：

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
   // 通过这种方式拿到被粘贴图片的file对象
   console.log('file:', file)
   // 两种方法都能拿到图片的file对象
   // console.log('clipboardData.files:', clipboardData.files[0])
})
```

借助FormData对象进行上传图片：

```js
var formData = new FormData();
formData.append('file', file);
// 其他些参数，例如用户id
formData.append('userid', 1);
// ajax上传
var xhr = new XMLHttpRequest();
// 上传结束
xhr.onload = function () {
    var json = JSON.parse(xhr.responseText);
    // ... 这里处理返回的json数据
};
xhr.open('POST', '/upload/files', true);
xhr.send(formData);
```

如果我们就传一个图片文件，没有其他数据的话，也可以直接send `file`对象，例如：

```js
// ajax上传
var xhr = new XMLHttpRequest();
// 上传结束
xhr.onload = function () {
    var json = JSON.parse(xhr.responseText);
    // ... 这里处理返回的json数据
};
xhr.open('POST', '/upload/files', true);
xhr.send(file);
```

## 预览剪切板中的图片

```js
const pasteImg = document.querySelector('.paste__img') // img标签
var reader = new FileReader()
reader.onload = function(event) {
    // event.target.result就是图片的Base64地址啦
    const dataURLOfPasteImg = event.target.result
    pasteImg.src = dataURLOfPasteImg
}
reader.readAsDataURL(file);
```

**再次注意**：这种只能上传剪切板中的图片

当我们使用QQ或者公司内部聊天工具中的截图工具截屏的时候，剪切板中是有截屏图片的；
当我们在任意网页中的图片上“右键-复制图片”，也是在剪切板中。

但是，但是，但是，我们在操作系统的文件夹中复制图片，不好意思，这个图片并不是在剪切板中，因此，无法上传。

这是个可能会让人困扰的地方。在windows文件夹系统中，我们复制文本类的东西，是在剪切板中，我们可以获得之；但是，复制的图片文件，不论是右键复制，还是Ctrl + C复制都不行。我曾经尝试找过“右键-复制到剪切板”这样的小工具，以便提高我们后台编辑人员的工作效率，失败了，如果谁知道有这样的工具，欢迎指教。

![](./images/4.png)

因此，桌面系统中的图片，目前实践下来，比较便捷的还是拖拽上传，以及文件选择框多选上传（[demo参见这里](https://www.zhangxinxu.com/study/201109/html5-file-image-ajax-upload.html)）。

**声明：此笔记大部分都摘抄自张鑫旭的博客和MDN，仅作学习笔记所用。**

