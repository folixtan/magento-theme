# Adobe Commerce 模板开发概念

> 来源: https://developer.adobe.com/commerce/frontend-core/guide/templates/override

## 一、模板基础概念

### 1. 模板是如何初始化的

模板在**布局文件**中初始化，每个布局 block 都有关联的模板。

模板通过 `<block>` 指令的 `template` 属性指定：

```xml
<block class="Magento\Catalog\Block\Category\View" 
       name="category.image" 
       template="Magento_Catalog::category/image.phtml">
```

**解析**：
- `category.image` block 由 `Magento_Catalog` 模块的 `category/image.phtml` 模板渲染
- 模板位置: `app/code/Magento/Catalog/view/frontend/templates/category/image.phtml`

### 2. 模板也可以在 PHP Block 类中指定

```xml
<block class="Magento\Review\Block\View" name="review_view" ifconfig="catalog/review/active"/>
```

在 Block 类中：

```php
// app/code/Magento/Review/Block/View.php
protected $_template = 'Magento_Review::view.phtml';
```

## 二、模板位置

| 类型 | 位置 |
|------|------|
| **模块模板** | `<module_dir>/view/frontend/templates/<path_to_templates>` |
| **主题模板** | `<theme_dir>/<Namespace>_<Module>/templates/<path_to_templates>` |

**示例**：
- `app/code/Magento/Catalog/view/frontend/templates/product/widget/new/content/new_grid.phtml`
- `app/design/frontend/Folix/game-theme/Magento_Catalog/templates/product/view.phtml`

## 三、模板覆盖规则（重要！）

对于同名模板文件，覆盖规则如下：

1. **主题模板覆盖模块模板**
2. **子主题模板覆盖父主题模板**

```
优先级: 子主题 > 父主题 > 模块
```

**示例**：
```
模块模板: vendor/magento/module-catalog/view/frontend/templates/product/view.phtml
父主题:   vendor/magento/theme-frontend-luma/Magento_Catalog/templates/product/view.phtml
子主题:   app/design/frontend/Folix/game-theme/Magento_Catalog/templates/product/view.phtml
                                                                     
最终使用: Folix/game-theme 版本 (优先级最高)
```

## 四、根模板

`<Magento_Theme_module_dir>/view/base/templates/root.phtml` 是所有店铺页面的根模板。

**特点**：
- 包含 `doctype` 声明
- 贡献所有页面的 `<head>` 和 `<body>` 部分
- 可以像其他模板一样被主题覆盖

## 五、在模板中获取布局参数

布局文件中设置的参数值，在模板中通过 block 的方法访问：

**布局文件**：
```xml
<argument name="store_name" xsi:type="string">ExampleCorp</argument>
```

**模板中获取**：
```php
// 获取参数值
$block->getData('store_name')
$block->getStoreName()

// 检查参数是否存在
$block->hasData('store_name')
$block->hasStoreName()
```

### 重要原则

> **模板必须不在其代码中实例化新对象。所有对象必须从 Block 对象传递。**
> 
> 这样，模板保持无状态，其唯一职责是显示从 Block 对象接收的数据。

## 六、PHP 短标签

模板中可以使用 PHP 短标签：

```php
<?= $block->getAdjustmentsHtml() ?>
// 等同于
<?php echo $block->getAdjustmentsHtml(); ?>
```

## 七、本地化（翻译）

支持翻译的内容必须用 `__()` 包裹：

```php
<span><?= $escaper->escapeHtml(__('Back to Product Reviews')) ?></span>
```

---

## 八、常见布局定制任务

### 1. 设置页面布局

```xml
<!-- 改变 Advanced Search 页面布局 -->
<page layout="2columns-left" xmlns:xsi="...">
    ...
</page>
```

### 2. 引入静态资源（JS, CSS, 字体）

```xml
<page xmlns:xsi="...">
  <head>
    <!-- 本地 CSS -->
    <css src="css/my-styles.css" />
    <css src="Namespace_Module::css/custom-styles.css" />
    
    <!-- 本地 JS -->
    <script src="Magento_Catalog::js/sample1.js" />
    <script async="" src="Magento_Catalog::js/sample1.js" />
    <script defer="" src="Magento_Catalog::js/sample1.js" />
    
    <!-- 外部资源 -->
    <css src="https://example.com/style.css" src_type="url" />
    <script src="https://example.com/script.js" src_type="url" />
  </head>
</page>
```

### 3. 移除静态资源

```xml
<page xmlns:xsi="...">
   <head>
    <!-- 移除 CSS -->
    <remove src="css/styles-m.css" />
    <remove src="Namespace_ModuleName::css/styles.css" />
    
    <!-- 移除 JS -->
    <remove src="my-js.js" />
    <remove src="Magento_Catalog::js/sample1.js" />
   </head>
</page>
```

### 4. 创建容器

```xml
<container name="some.container" 
           as="someContainer" 
           label="Some Container" 
           htmlTag="div" 
           htmlClass="some-container" />
```

### 5. 引用容器（更新容器）

```xml
<!-- 添加内容到容器 -->
<referenceContainer name="header.panel">
  <block class="Magento\Framework\View\Element\Html\Links" name="header.links">
    <arguments>
      <argument name="css_class" xsi:type="string">header links</argument>
    </arguments>
  </block>
</referenceContainer>

<!-- 添加 CSS 类 -->
<referenceContainer name="page.wrapper" htmlClass="my-new-class second-class"/>

<!-- 添加 ID -->
<referenceContainer name="page.wrapper" htmlId="MyWrapper"/>

<!-- 移除容器 -->
<referenceContainer name="product.info.stock.sku" remove="true"/>
```

### 6. 创建 Block

```xml
<block class="Magento\Catalog\Block\Product\View\Description" 
       name="product.info.sku" 
       template="Magento_Catalog::product/view/attribute.phtml" 
       after="product.info.type">
  <arguments>
    <argument name="at_call" xsi:type="string">getSku</argument>
    <argument name="at_label" xsi:type="string">none</argument>
    <argument name="title" translate="true" xsi:type="string">SKU</argument>
    <argument name="add_attribute" xsi:type="string">itemprop="sku"</argument>
  </arguments>
</block>
```

### 7. 引用 Block（更新 Block）

```xml
<!-- 移除 Block -->
<referenceBlock name="block.name" remove="true"/>
```

---

## 九、Folix 主题应用示例

### 正确的模板覆盖

```
要覆盖: vendor/magento/module-customer/view/frontend/templates/account/dashboard/info.phtml

正确位置: app/design/frontend/Folix/game-theme/Magento_Customer/templates/account/dashboard/info.phtml
```

### 正确的布局扩展

```
要扩展: vendor/magento/module-customer/view/frontend/layout/customer_account.xml

正确位置: app/design/frontend/Folix/game-theme/Magento_Customer/layout/customer_account.xml
```

### 错误做法（不要这样做）

```
❌ 直接修改模块文件
❌ 在主题根目录创建布局文件
❌ 重复定义已存在的 block
```

---

## 十、总结

| 操作 | 方法 | 文件位置 |
|------|------|---------|
| 覆盖模板 | 同名文件覆盖 | `<theme>/<Module>/templates/` |
| 扩展布局 | 使用 `<referenceContainer>` / `<referenceBlock>` | `<theme>/<Module>/layout/` |
| 新增 Block | 使用 `<block>` | 布局文件中 |
| 移除元素 | `remove="true"` | 布局文件中 |
| 移动元素 | `<move element="..." destination="..."/>` | 布局文件中 |

**核心原则**：
1. **扩展优先** - 使用 `<referenceContainer>` 扩展而非覆盖
2. **主题覆盖** - 在主题目录中创建同名文件
3. **不修改核心** - 永远不要直接修改 `vendor/` 目录
