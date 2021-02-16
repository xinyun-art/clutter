## BEM

### 简介

BEM 分别代表着：Block（块）、Element（元素）、Modifier（修饰符），是一种组件化的 CSS 命名方法和规范，由俄罗斯 Yandex 团队所提出。其目的是将用户界面划分成独立的（模）块，使开发更为简单和快速，利于团队协作开发。

### 特点

- 组件化/模块化的开发思路。
- 书写方式解耦化，不会造成命名空间的污染，如：.xxx ul li 写法带来的潜在嵌套风险。
- 命名方式化扁平，避免样式层级过多而导致的解析效率降低，渲染开销变大。
- 组件结构独立化，减少样式冲突，可以将已开完成的组件快速应用到新项目中。
- 有着较好的维护性、易读性、灵活性。

### 规则

BEM的命名模式在社区中有着不同方式，以下为 Yandex 团队所提出的命名规则为

```css
.[Block 块]__[Element 元素]_[Modifier 修饰符]
```

不同的命名模式，区别在于BEM之间的连接符号不同，依个人而定：

```css
.[Block 块]__[Element 元素]--[Modifier 修饰符]
```

任何一种规范，都是基于实际需求而定，便于团队开发和维护扩展，每个规范都是经过合理评估后所得出的一种“思路”和“建议”。

### BLOCK（块）

是一个独立的实体，即通常所说的模块或组件。

例：`header`、`menu`、`button`

### BLOCK命名&书写规则

- 块名需能清晰的表达出，其用途、功能或意义，具有唯一性。
- 块名称之间用`-`连接。
- 每个块名前应增加一个前缀，这前缀在 CSS 中有命名空间（如：m-、u-、分别代表：mod 模块、ui 元件）。
- 每个块在逻辑上和功能上都相互独立。
- 由于块是独立的，可以在应用开发中进行复用，从而降低代码重复并提高开发效率。
- 块可以放置在页面上的任何位置，也可以互相嵌套。
- 同类型的块，在显示上可能会有一定的差异，所以不要定义过多的外观显示样式，主要负责结构的呈现。
- 这样就能确保块在不同地方复用和嵌套时，增加其扩展性。

综上所述，最终我们可以把BEM规则最终定义成：

```css
.[命名空间]-[组件名/模块名]__[元素名/元素]_[修饰符]
```

关于命名空间，可参考网易[nec](http://nec.netease.com/standard/css-sort.html)规范：

- 布局（grid）（.g-）：将页面分割为几个大块，通常有头部、主体、主栏、侧栏、尾部等！
- 模块（module）（.m-）：通常是一个语义化的可以重复使用的较大的整体！比如导航、登录、注册、各种列表、评论、搜索等！
- 元件（unit）（.u-）：通常是一个不可再分的较为小巧的个体，通常被重复用于各种模块中！比如按钮、输入框、loading、图标等！
- 功能（function）（.f-）：为方便一些常用样式的使用，我们将这些使用率较高的样式剥离出来，按需使用，通常这些选择器具有固定样式表现，比如清除浮动等！不可滥用！
- 皮肤（skin）（.s-）：如果你需要把皮肤型的样式抽离出来，通常为文字色、背景色（图）、边框色等，非换肤型网站通常只提取文字色！非换肤型网站不可滥用此类！
- 状态（.z-）：为状态类样式加入前缀，统一标识，方便识别，她只能组合使用或作为后代出现（.u-ipt.z-dis{}，.m-list li.z-sel{}），具体详见[命名规则](http://nec.netease.com/standard/css-name.html)的扩展相关项。

### 情景

需要构建一个 `search` 组件。

写法：

```css
.m-search{}
```

布局结构：

```html
<!-- header 组件（m- 作为命名空间始终） -->
<div class="m-header">
    <!-- search 组件（可以嵌套在其他组件内） -->
    <form class="m-search">
    </form>
</div>
```

如果打算开发一套框架，可以使用具有代表性的缩写，用来表示命名空间：Element UI(el-)、Ant Design(ant-)、iView(ivu-)。

### Element（元素）

是块中的组成部分，对应块中的子元素/子节点。

例：`header title`、`menu item`、`list item`

### 规则

- 元素名需能简单的描述出，其结构、布局或意义，并且在**语义上与块相关联**。
- 块与元素之间用`__`连接。
- 不能与块分开单独使用。
- 块的内部元素，都被认为是块的子元素。
- 一个块中元素的类名必须用父级块的名称作为前缀，因此不能写成：`block__elem1__elem2`。

### 情景

`search` 组件中包含 `input` 和 `button`，是列表中的一个子元素。

写法：

```css
.m-search{}
.m-search__input{}
.m-search__button{}
```

布局结构：

```html
<!-- search 组件 -->
<form class="m-search">
    <!-- input 是 search 组件的子元素 -->
    <input class="m-search__input">
    <!-- button 是 search 组件的子元素 -->
    <button class="m-search__button">Search</button>
</form>
```

原则上书写时不会出现两层以上的嵌套，所有样式都为平级，嵌套只出现在 `.m-block_active`，状态激活时的情况。

### Modifier（修饰符）

定义块和元素的外观、状态或类型。

例：`color`、`disabled`、`size`

### 规则

- 修饰符需能直观易懂表达出，其外观、状态或行为。
- 修饰符用`_`连接块与元素（也可以用`--`）。
- 修饰符不能单独使用。
- 在必要时可进行扩展，书写成：`block__elem_modifier_modifier`，第一个 `modifier` 表示其命名空间。

### 情景

假定 `search` 组件有多种外观，我们选择其中一种。并且在用户未输入内容时，`button` 显示为禁用样式。

写法：

```css
.m-search{}
.m-search_dark{}
.m-search__input{}
.m-search__button{}
.m-search__button_disabled{}
```

布局结构：

```html
<!-- dark 表明 search 组件的外观 -->
<form class="m-search m-search-form_dark">
    <input class="m-search__input">
    <!-- disabled 表明 search__button 的状态 -->
    <button class="m-search__button m-search__button_disabled">Search</button>
</form>
```