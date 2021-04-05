### base64到blob：

比如png格式的base64图片转成blob类型：

```js
function pngBase64ToBlob(urlData) {
    try {
        var arr = urlData.split(',')
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
 
        return new Blob([ab], {
            type: mime
        });
    }
    catch (e) {
        var ab = new ArrayBuffer(0);
        return new Blob([ab], {
            type: 'image/png',
        });
    }
}
```

其他格式的图片类似，于是可以写一个通用的图片接口：

```js

function imageBase64ToBlob(urlData, type='image/jpeg') {
    try {
        var arr = urlData.split(',')
        var mime = arr[0].match(/:(.*?);/)[1] || type;
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
 
        return new Blob([ab], {
            type: mime
        });
    } catch (e) {
        var ab = new ArrayBuffer(0);
        return new Blob([ab], {
            type: type,
        });
    }
}
```

### blob转本地url：

```js
function blobToUrl(blob_data) {
    return URL.createObjectURL(blob_data)
}
```

### blob转base64：

```js
function blobToBase64(blob_data, callback) {
    let reader = new FileReader()
    reader.onload = (e) => {
        if (callback) {
            callback(e.target.result)
        }
    }
    reader.readAsDataURL(blob_data)
}
```

### url转blob：

```js
function urlToBlob(the_url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", the_url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        if (this.status == 200) {
            if (callback) {
                callback(this.response);
            }
        }
    };
    xhr.send();
}
```

有了以上接口就可以三种格式互相转换了，不过url转blob和blob转base64是异步的操作，此外url还分服务器端url和浏览器本地url，需要自己使用时区分清楚。