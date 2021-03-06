## 概述

- 快速响应的网站提供更好的用户体验。用户期待内容快速加载和交互流畅的Web体验。
- **等待资源加载时间**和大部分情况下的**浏览器单线程执行**是影响Web性能的两大主要原因。
- 等待时间是需要去克服来让浏览器快速加载资源的主要威胁，为了实现快速加载，开发者的目标就是尽可能快的发送请求的信息。网络等待时间是在链路上传送二进制到电脑端所消耗的链路传输时间。 Web性能优化需要做的就是尽可能快的使页面加载完成。
- 大部分情况下，浏览器是单线程执行的。为了有流畅的交互 ，开发者的目标是确保网站从流畅的页面滚动到点击响应的交互性能。渲染时间是关键要素，确保主线程可以完成所有给它的任务并且仍然一直可以处理用户的交互。通过了解浏览器单线程的本质与最小化主线程的责任可以优化Web性能，来确保渲染的流畅和交互响应的及时。

## 导航

- 导航是加载web页面的第一步。它发生在以下情形：用户通过在地址栏输入一个URL、点击一个链接、提交表单或者是其他的行为。

  ![](./How Browsers Work/input-nav.png)

- web性能优化的目标之一就是缩短导航完成所花费的时间，在理想情况下，它通常不会花费太多的时间，但是等待资源加载时间和带宽会导致它的延时。

## DNS查找

1. 我们在浏览器输入网址，其实就是要向服务器请求我们想要的页面内容，对于一个web页面来说导航的第一步是要去**寻找页面资源的位置**。所有浏览器首先要确认的是**域名所对应的服务器**在哪里。将域名解析成对应的服务器IP地址这项工作，是由DNS服务器来完成的。客户端收到你输入的域名地址后，它首先去找本地的hosts文件，检查在该文件中是否有相应的域名、IP对应关系，如果有，则向其IP地址发送请求，如果没有，再去找DNS服务器。

   DNS服务器层次结构:

   ![](./How Browsers Work/DNS.png)

2. 浏览器客户端向本地DNS服务器发送一个含有域名www.cnblogs.com的DNS查询报文。本地DNS服务器把查询报文转发到根DNS服务器，根DNS服务器注意到其com后缀，于是向本地DNS服务器返回comDNS服务器的IP地址。本地DNS服务器再次向comDNS服务器发送查询请求，comDNS服务器注意到其www.cnblogs.com后缀并用负责该域名的权威DNS服务器的IP地址作为回应。最后，本地DNS服务器将含有www.cnblogs.com的IP地址的响应报文发送给客户端。

   第一次初始化请求之后，这个IP地址可能会被缓存一段时间，这样可以通过从缓存里面检索IP地址而不是再通过域名服务器进行查找来加速后续的请求。

   从客户端到本地服务器属于**递归查询**，而DNS服务器之间的交互属于**迭代查询**。

   正常情况下，本地DNS服务器的缓存中已有comDNS服务器的地址，因此请求根域名服务器这一步不是必需的。

   ![](./How Browsers Work/DNS-query.png)

3. 通过主机名加载一个页面通常仅需要DNS查找一次。但是DNS需要对不同的页面指向的主机名进行查找。如果fonts, images, scripts, ads, and metrics 都不同的主机名，DNS会对每一个进行查找。

   ![](./How Browsers Work/latency.jpg)

4. DNS查找对于性能来说是一个问题，特别是对于移动网络。当一个用户用的是移动网络，每一个DNS查找必须从手机发送到信号塔，然后到达一个认证DNS服务器。手机、信号塔、域名服务器之间的距离可能是一个大的时间等待。

## TCP HandShake

- 一旦获取到服务器IP地址，浏览器就会通过TCP”三次握手“与服务器建立连接。这个机制是用来让两端尝试进行通信—浏览器和服务器在发送数据之前，通过上层协议Https可以协商网络TCP套接字连接的一些参数。

- TCP的”三次握手“技术经常被称为”SYN-SYN-ACK“—更确切的说是 SYN, SYN-ACK, ACK—因为通过TCP首先发送了三个消息进行协商，开始一个TCP会话在两台电脑之间。 是的，这意味着每台服务器之间还要来回发送三条消息，而请求尚未发出。

  ![](./How Browsers Work/TCP-handShake.png)

  客户端发送一个带有SYN标志的数据包给服务端，服务端收到后，回传一个带有SYN/ACK标志的数据包以示传达确认信息，最后客户端再回传一个带ACK标志的数据包，代表握手结束，连接成功。

## TLS 协商

- 为了在**HTTPS**上建立安全连接，另一种握手是必须的。更确切的说是TLS协商 ，它决定了什么密码将会被用来加密通信，验证服务器，在进行真实的数据传输之前建立安全连接。在发送真正的请求内容之前还需要三次往返服务器。

  ![](./How Browsers Work/ssl.jpg)

- 虽然建立安全连接对增加了加载页面的等待时间，对于建立一个安全的连接来说，以增加等待时间为代价是值得的，因为在浏览器和web服务器之间传输的数据不可以被第三方解密。

- 经过8次往返，浏览器终于可以发出请求。

## 发送HTTP请求

与服务器建立了连接后，就可以向服务器发起请求了。这里我们先看下**请求报文**的结构（如下图）：

![](./How Browsers Work/http-req.png)

在浏览器中查看报文首部（以google浏览器为例）：

![](./How Browsers Work/http-req-head.png)

请求行包括请求方法、URI、HTTP版本。首部字段传递重要信息，包括请求首部字段、通用首部字段和实体首部字段。我们可以从报文中看到发出的请求的具体信息。具体每个首部字段的作用，这里不做过多阐述。

## 服务器处理请求

服务器端收到请求后由web服务器（准确说应该是http服务器）处理请求，诸如Apache、Ngnix、IIS等。web服务器解析用户请求，知道了需要调度哪些资源文件，再通过相应的这些资源文件处理用户请求和参数，并调用数据库信息，最后将结果通过web服务器返回给浏览器客户端。

![](./How Browsers Work/server-handle-req.png)

## 响应

- 在HTTP里，有请求就会有响应，哪怕是错误信息。这里我们同样看下**响应报文**的组成结构：

  ![](./How Browsers Work/http-res.png)

  在响应结果中都会有个一个HTTP状态码，比如我们熟知的200、301、404、500等。通过这个状态码我们可以知道服务器端的处理是否正常，并能了解具体的错误。

  状态码由3位数字和原因短语组成。根据首位数字，状态码可以分为五类：

  ![](./How Browsers Work/status-code.png)

- 一旦我们建立了到web服务器的连接，浏览器就代表用户发送一个初始的HTTP GET请求，对于网站来说，这个请求通常是一个HTML文件。 一旦服务器收到请求，它将使用相关的响应头和HTML的内容进行回复。

- ```html
  <!doctype HTML>
  <html>
   <head>
    <meta charset="UTF-8"/>
    <title>My simple page</title>
    <link rel="stylesheet" src="styles.css"/>
    <script src="myscript.js"></script>
  </head>
  <body>
    <h1 class="heading">My Page</h1>
    <p>A paragraph with a <a href="https://example.com/about">link</a></p>
    <div>
      <img src="myimage.jpg" alt="image description"/>
    </div>
    <script src="anotherscript.js"></script>
  </body>
  </html>
  ```

- 上面的例子中，这个请求肯定是小于14kb的，但是直到浏览器在解析阶段遇到链接时才会去请求链接的资源，下面有进行描述。

## TCP 慢开始 / 14kb 规则

- 第一个响应包是14kb大小。这是慢开始的一部分，慢开始是一种均衡网络连接速度的算法。慢开始逐渐增加发送数据的数量直到达到网络的最大带宽。

- 在"TCP slow start"中，在收到初始包之后, 服务器会将下一个包的大小加倍到大约28kb。 后续的包依次是前一个包大小的二倍直到达到预定的阈值，或者遇到拥塞。

  ![](./How Browsers Work/congestioncontrol.jpg)

- 如果您听说过初始页面加载的14Kb规则，TCP慢开始就是初始响应为14Kb的原因，也是为什么web性能优化需要将此初始14Kb响应作为优化重点的原因。TCP慢开始逐渐建立适合网络能力的传输速度，以避免拥塞。

## 拥塞控制

- 当服务器用TCP包来发送数据时，客户端通过返回确认帧来确认传输。由于硬件和网络条件，连接的容量是有限的。 如果服务器太快地发送太多的包，它们可能会被丢弃。意味着，将不会有确认帧的返回。服务器把它们当做确认帧丢失。拥塞控制算法使用这个发送包和确认帧流来确定发送速率。

 ## 关闭TCP连接

为了避免服务器与客户端双方的资源占用和损耗，当双方没有请求或响应传递时，任意一方都可以发起关闭请求。与创建TCP连接的3次握手类似，关闭TCP连接，需要4次握手。

![](./How Browsers Work/TCP-close.png)

上图可以这么理解：

客户端：“兄弟，我这边没数据要传了，咱关闭连接吧。”

服务端：“收到，我看看我这边有木有数据了。”

服务端：“兄弟，我这边也没数据要传你了，咱可以关闭连接了。”

客户端：“好嘞。”

## 浏览器主要组件结构

![](./How Browsers Work/browser.png)

## 渲染引擎——webkit和Gecko

- Firefox使用Geoko——Mozilla自主研发的渲染引擎。

- Safari和Chrome都使用webkit。Webkit是一款开源渲染引擎，它本来是为linux平台研发的，后来由Apple移植到Mac及Windows上。

- 本文我主要以webkit渲染引擎来讲解，尽管webkit和Gecko使用的术语稍有不同，他们的主要流程基本相同。

  ![](./How Browsers Work/render.png)

## 浏览器渲染过程

![](./How Browsers Work/render-step.png)

浏览器渲染过程大体分为如下三部分：

1. **浏览器会解析三个东西：**

   - 一是 HTML/SVG/XHTML，HTML 字符串描述了一个页面的结构，浏览器会把 HTML 结构字符串解析转换 DOM 树形结构。

     ![](./How Browsers Work/html-parser.png)

   - 二是 CSS，解析 CSS 会产生 CSS 规则树，它和 DOM 结构比较像。

     ![](./How Browsers Work/css-parser.png)

   - 三是 Javascript 脚本，等到 Javascript 脚本文件加载后， 通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree。

     ![](./How Browsers Work/js-parser.png)

2. **解析完成后，浏览器引擎会通过 DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。**

   - Rendering Tree 渲染树并不等同于 DOM 树，渲染树只会包括需要显示的节点和这些节点的样式信息。
   - CSS 的 Rule Tree 主要是为了完成匹配并把 CSS Rule 附加上 Rendering Tree 上的每个 Element（也就是每个 Frame）。
   - 然后，计算每个 Frame 的位置，这又叫 layout 和 reflow 过程。

3. **最后通过调用操作系统 Native GUI 的 API 绘制。**



## 关键渲染路径

关键渲染路径是指浏览器从最初接收请求来的HTML、CSS、javascript等资源，然后解析、构建树、渲染布局、绘制，最后呈现给客户能看到的界面这整个过程。

所以浏览器的渲染过程主要包括以下几步：

1. 解析HTML生成DOM树。
2. 解析CSS生成CSSOM规则树。
3. 将DOM树与CSSOM规则树合并在一起生成渲染树。
4. 遍历渲染树开始布局，计算每个节点的位置大小信息。
5. 将渲染树每个节点绘制到屏幕。

接下来我们针对这其中所经历的重要步骤详细阐述。

## 解析

- 一旦浏览器收到数据的第一块，它就可以开始解析收到的信息。“推测性解析”，“解析”是浏览器将通过网络接收的数据转换为DOM和CSSOM的步骤，通过渲染器把DOM和CSSOM在屏幕上绘制成页面。
- 即使请求页面的HTML大于初始的14KB数据包，浏览器也将开始解析并尝试根据其拥有的数据进行渲染。这就是为什么在前14Kb中包含浏览器开始渲染页面所需的所有内容，或者至少包含页面模板（第一次渲染所需的CSS和HTML）对于web性能优化来说是重要的。但是在渲染到屏幕上面之前，HTML、CSS、JavaScript必须被解析完成。

## 构建DOM树

1. 第一步是处理HTML标记并构造DOM树。HTML解析涉及到 [tokenization](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) 和树的构造。HTML标记包括开始和结束标记，以及属性名和值。 如果文档格式良好，则解析它会简单而快速。解析器将标记化的输入解析到文档中，构建文档树。

2. DOM树描述了文档的内容。<html>元素是第一个标签也是文档树的根节点。树反映了不同标记之间的关系和层次结构。嵌套在其他标记中的标记是子节点。DOM节点的数量越多，构建DOM树所需的时间就越长。

   ![](./How Browsers Work/DOM.gif)

## 预加载扫描器

- 浏览器构建DOM树时，这个过程占用了主线程。当这种情况发生时，预加载扫描仪将解析可用的内容并请求高优先级资源，如CSS、JavaScript和web字体。多亏了预加载扫描器，我们不必等到解析器找到对外部资源的引用来请求它。它将在后台检索资源，以便在主HTML解析器到达请求的资源时，它们可能已经在运行，或者已经被下载。预加载扫描仪提供的优化减少了阻塞。

- ```html
  <link rel="stylesheet" src="styles.css"/>
  <script src="myscript.js" async></script>
  <img src="myimage.jpg" alt="image description"/>
  <script src="anotherscript.js" async></script>
  ```

  在这个例子中，当主线程在解析HTML和CSS时，预加载扫描器将找到脚本和图像，并开始下载它们。为了确保脚本不会阻塞进程，当JavaScript解析和执行顺序不重要时，可以添加async属性或defer属性。

- 等待获取CSS不会阻塞HTML的解析或者下载，但是它的确阻塞JavaScript，因为JavaScript经常用于查询元素的CSS属性。

## 构建CSSOM树

1. 第二步是处理CSS并构建CSSOM树。CSS对象模型和DOM是相似的。DOM和CSSOM是两棵树. 它们是独立的数据结构。浏览器将CSS规则转换为可以理解和使用的样式映射。浏览器遍历CSS中的每个规则集，根据CSS选择器创建具有父、子和兄弟关系的节点树。
2. CSSOM树包括来自用户代理样式表的样式。浏览器从适用于节点的最通用规则开始，并通过应用更具体的规则递归地优化计算的样式。
3. 构建CSSOM非常非常快，并且在当前的开发工具中没有以独特的颜色显示。相反，开发人员工具中的“重新计算样式”显示解析CSS、构造CSSOM树和递归计算计算样式所需的总时间。在web性能优化方面，它是可轻易实现的，因为创建CSSOM的总时间通常小于一次DNS查找所需的时间。

## 其他过程

## JavaScript 编译

- 当CSS被解析并创建CSSOM时，其他资源，包括JavaScript文件正在下载（多亏了preload scanner）。JavaScript被解释、编译、解析和执行。脚本被解析为抽象语法树。一些浏览器引擎使用”Abstract Syntax Tree“并将其传递到解释器中，输出在主线程上执行的字节码。这就是所谓的JavaScript编译。

## 构造辅助功能树

- 浏览器还构建辅助设备用于分析和解释内容的辅助功能（[accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility) ）树。可访问性对象模型（AOM）类似于DOM的语义版本。当DOM更新时，浏览器会更新辅助功能树。辅助技术本身无法修改可访问性树。
- 在构建AOM之前，屏幕阅读器（[screen readers](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Screen_Reader_Implementors_Guide)）无法访问内容。

## 渲染

- 当我们生成 DOM 树和 CSSOM 树以后，就需要将这两棵树组合为渲染树。

- 渲染步骤包括样式、布局、绘制，在某些情况下还包括合成。在解析步骤中创建的CSSOM树和DOM树组合成一个**Render树**，然后用于计算每个可见元素的布局，然后将其绘制到屏幕上。在某些情况下，可以将内容提升到它们自己的层并进行合成，通过在GPU而不是CPU上绘制屏幕的一部分来提高性能，从而释放主线程。

  ![](./How Browsers Work/render-tree.png)

  在这一过程中，不是简单的将两者合并就行了。**渲染树只会包括需要显示的节点和这些节点的样式信息**，如果某个节点是 `display: none` 的，那么就不会在渲染树中显示。

- 我们或许有个疑惑：**浏览器如果渲染过程中遇到 JS 文件怎么处理**？

  渲染过程中，如果遇到`<script>`就停止渲染，执行 JS 代码。因为浏览器有 GUI 渲染线程与 JS 引擎线程，为了防止渲染出现不可预期的结果，这两个线程是互斥的关系。JavaScript 的加载、解析与执行会阻塞 DOM 的构建，也就是说，在构建 DOM 时，HTML 解析器若遇到了 JavaScript，那么它会暂停构建 DOM，将控制权移交给 JavaScript 引擎，等 JavaScript 引擎运行完毕，浏览器再从中断的地方恢复 DOM 构建。

  也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件，这也是都建议将 script 标签放在 body 标签底部的原因。当然在当下，并不是说 script 标签必须放在底部，因为你可以给 script 标签添加 defer 或者 async 属性。

  **JS 文件不只是阻塞 DOM 的构建，它会导致 CSSOM 也阻塞 DOM 的构建**。

  原本 DOM 和 CSSOM 的构建是互不影响，井水不犯河水，但是一旦引入了 JavaScript，CSSOM 也开始阻塞 DOM 的构建，只有 CSSOM 构建完毕后，DOM 再恢复 DOM 构建。

  这是因为 JavaScript 不只是可以改 DOM，它还可以更改样式，也就是它可以更改 CSSOM。因为不完整的 CSSOM 是无法使用的，如果 JavaScript 想访问 CSSOM 并更改它，那么在执行 JavaScript 时，必须要能拿到完整的 CSSOM。所以就导致了一个现象，如果浏览器尚未完成 CSSOM 的下载和构建，而我们却想在此时运行脚本，那么浏览器将延迟脚本执行和 DOM 构建，直至其完成 CSSOM 的下载和构建。也就是说，**在这种情况下，浏览器会先下载和构建 CSSOM，然后再执行 JavaScript，最后在继续构建 DOM**。

  ![](./How Browsers Work/css-block.png)

## Style

- 第三步是将DOM和CSSOM组合成一个Render（渲染）树，计算样式树或渲染树从DOM树的根开始构建，遍历每个可见节点。
- 像<head>和它的子节点以及任何具有`display: none`样式的结点，例如`script { display: none; }`（在user agent stylesheets可以看到这个样式）这些标签将不会显示，也就是它们不会出现在Render树上。具有`visibility: hidden`的节点会出现在Render树上，因为它们会占用空间。由于我们没有给出任何指令来覆盖用户代理默认值，因此上面代码示例中的script节点将不会包含在Render树中。
- 每个可见节点都应用了其CSSOM规则。Render树保存所有具有内容和计算样式的可见节点——将所有相关样式匹配到DOM树中的每个可见节点，并根据CSS级联确定每个节点的计算样式。

## Layout

- 第四步是在渲染树上运行布局以计算每个节点的几何体。布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。
- 构建渲染树后，开始布局。渲染树标识显示哪些节点（即使不可见）及其计算样式，但不标识每个节点的尺寸或位置。为了确定每个对象的确切大小和位置，浏览器从渲染树的根开始遍历它。
- 在网页上，大多数东西都是一个盒子。不同的设备和不同的桌面意味着无限数量的不同的视区大小。在此阶段，考虑到视区大小，浏览器将确定屏幕上所有不同框的尺寸。以视区的大小为基础，布局通常从body开始，用每个元素的框模型属性排列所有body的子孙元素的尺寸，为不知道其尺寸的替换元素（例如图像）提供占位符空间。
- 第一次确定节点的大小和位置称为布局。随后对节点大小和位置的重新计算称为回流。在我们的示例中，假设初始布局发生在返回图像之前。由于我们没有声明图像的大小，因此一旦知道图像大小，就会有回流。

## Paint

- 最后一步是将各个节点绘制到屏幕上，第一次出现的节点称为[first meaningful paint](https://developer.mozilla.org/en-US/docs/Glossary/first_meaningful_paint)。在绘制或光栅化阶段，浏览器将在布局阶段计算的每个框转换为屏幕上的实际像素。绘画包括将元素的每个可视部分绘制到屏幕上，包括文本、颜色、边框、阴影和替换的元素（如按钮和图像）。浏览器需要非常快地完成这项工作。
- 为了确保平滑滚动和动画。占据主线程的所有的内容：包括计算样式，以及回流和绘制，必须让浏览器在16.67毫秒内完成。在2048x 1536，iPad有超过314.5万像素将被绘制到屏幕上。那是很多像素需要快速绘制。为了确保重绘的速度比初始绘制的速度更快，屏幕上的绘图通常被分解成数层。如果发生这种情况，则需要进行合成。
- 绘制可以将布局树中的元素分解为多个层。将内容提升到GPU上的层（而不是CPU上的主线程）可以提高绘制和重新绘制性能。有一些特定的属性和元素可以实例化一个层，包括<video>和<canvas>，任何CSS属性为opacity、3D转换、`will-change`的元素，还有一些其他元素。这些节点将与子节点一起绘制到它们自己的层上，除非子节点由于上述一个（或多个）原因需要自己的层。
- 层确实可以提高性能，但是它以内存管理为代价，因此不应作为web性能优化策略的一部分过度使用。

## Compositing

- 当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。
- 当页面继续加载资产时，可能会发生回流（回想一下我们迟到的示例图像），回流会触发重新绘制和重新组合。如果我们定义了图像的大小，就不需要重新绘制，只需要重新绘制需要重新绘制的层，并在必要时进行合成。但我们没有包括图像大小！从服务器获取图像后，渲染过程将返回到布局步骤并从那里重新开始。

## 交互

- 一旦主线程绘制页面完成，你会认为我们已经“准备好了”，但事实并非如此。如果加载包含JavaScript（并且延迟到`onload`事件激发后执行），则主线程可能很忙，无法用于滚动、触摸和其他交互。

- ”Time to Interactive“（TTI）是测量从第一个请求导致DNS查找和SSL连接到页面可交互时所用的时间——可交互是”First Contentful Paint“之后的时间点，页面在50ms内响应用户的交互。如果主线程正在解析、编译和执行JavaScript，则它不可用，因此无法及时（小于50ms）响应用户交互。

- 在我们的示例中，可能图像加载很快，但`anotherscript.js`文件可能是2 MB，而且用户的网络连接很慢。在这种情况下，用户可以非常快地看到页面，但是在下载、解析和执行脚本之前，就无法滚动。这不是一个好的用户体验。避免占用主线程，如下面的WebPageTest示例所示：

  ![](./How Browsers Work/visa_network.png)

  在本例中，DOM内容加载过程花费了1.5秒多的时间，主线程在这段时间内完全被占用，对单击事件或屏幕点击没有响应。

## 补充

### async 和 defer 的作用是什么？有什么区别?

![](./How Browsers Work/async-defer.png)

其中蓝色线代表 JavaScript 加载；红色线代表 JavaScript 执行；绿色线代表 HTML 解析。

- **情况 1**`**<script src="script.js"></script>**`

  没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。

- **情况 2 `<script defer src="script.js"></script>`(**延迟执行)

  defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。

- **情况 3**`<script async src="script.js"></script>**`  (异步下载)

  async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是 DOMContentLoaded 触发之后。需要注意的是，这种方式加载的 JavaScript 依然会阻塞 load 事件。换句话说，async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。

- defer 与相比普通 script，有两点区别：**载入 JavaScript 文件时不阻塞 HTML 的解析，执行阶段被放到 HTML 标签解析完成之后。**

- **在加载多个 JS 脚本的时候，async 是无顺序的加载，而 defer 是有顺序的加载。**

### 为什么操作 DOM 慢？

- 把 DOM 和 JavaScript 各自想象成一个岛屿，它们之间用收费桥梁连接。——《高性能 JavaScript》

- JS 是很快的，在 JS 中修改 DOM 对象也是很快的。在 JS 的世界里，一切是简单的、迅速的。但 DOM 操作并非 JS 一个人的独舞，而是两个模块之间的协作。

- 因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西。当我们用 JS 去操作 DOM 时，本质上是 JS 引擎和渲染引擎之间进行了“跨界交流”。这个“跨界交流”的实现并不简单，它依赖了桥接接口作为“桥梁”（如下图）。

  ![](./How Browsers Work/js-dom.png)

- 过“桥”要收费——这个开销本身就是不可忽略的。我们每操作一次 DOM（不管是为了修改还是仅仅为了访问其值），都要过一次“桥”。过“桥”的次数一多，就会产生比较明显的性能问题。因此“减少 DOM 操作”的建议，并非空穴来风。

### 参考

- [](https://www.xuecaijie.com/it/157.html#1Q64p5DeC8dKFF)
- [](https://developer.mozilla.org/zh-CN/docs/Web/Performance/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
- [](https://www.infoq.cn/article/dltdultozik_zrqfb4jg)

### 说明

此文档只是为本人学习/做笔记所用，故内容基本为其他网站直接摘抄过来的。

