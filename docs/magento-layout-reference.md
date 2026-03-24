# Magento 2 布局指令快速参考

## 一、容器操作

### 创建容器
```xml
<container name="name" 
           label="Label"
           htmlTag="div|section|header|footer|nav"
           htmlClass="class-name"
           htmlId="element-id"
           before="container.name|-"
           after="container.name|-">
</container>
```

### 引用容器（添加内容）
```xml
<referenceContainer name="header.container">
    <block ... />
</referenceContainer>
```

### 删除容器
```xml
<referenceContainer name="container.name" remove="true"/>
```

---

## 二、块操作

### 创建块
```xml
<block class="Magento\Framework\View\Element\Template"
       name="block.name"
       template="Magento_Theme::html/template.phtml"
       before="-|block.name"
       after="-|block.name"
       cacheable="true|false">
    <arguments>
        <argument name="title" xsi:type="string">Title</argument>
        <argument name="show_link" xsi:type="boolean">true</argument>
        <argument name="limit" xsi:type="number">10</argument>
    </arguments>
</block>
```

### 常用块类型
```xml
<!-- 文本块 -->
<block class="Magento\Framework\View\Element\Text">
    <arguments>
        <argument name="text" xsi:type="string">HTML 内容</argument>
    </arguments>
</block>

<!-- CMS 静态块 -->
<block class="Magento\Cms\Block\Block" name="cms.block">
    <arguments>
        <argument name="block_id" xsi:type="string">block-identifier</argument>
    </arguments>
</block>

<!-- 模板块 -->
<block class="Magento\Framework\View\Element\Template"
       template="Module::path/to/template.phtml"/>

<!-- 产品列表 -->
<block class="Magento\Catalog\Block\Product\ListProduct"
       name="category.products.list"/>

<!-- Logo -->
<block class="Magento\Theme\Block\Html\Header\Logo"/>
```

### 引用块（修改）
```xml
<referenceBlock name="block.name">
    <!-- 修改参数 -->
    <arguments>
        <argument name="title" xsi:type="string">New Title</argument>
    </arguments>
    
    <!-- 添加动作 -->
    <action method="setTemplate">
        <argument name="template" xsi:type="string">
            Module::new/template.phtml
        </argument>
    </action>
</referenceBlock>
```

### 删除/隐藏块
```xml
<!-- 完全删除（不渲染） -->
<referenceBlock name="block.name" remove="true"/>

<!-- 隐藏（渲染但不显示） -->
<referenceBlock name="block.name" display="false"/>
```

---

## 三、移动元素

```xml
<move element="block.name"
      destination="target.container"
      before="-|block.name"
      after="-|block.name"/>
```

**示例：**
```xml
<!-- 移动 Logo 到头部包装器最前面 -->
<move element="logo" destination="header-wrapper" before="-"/>

<!-- 移动搜索框到导航后面 -->
<move element="top.search" destination="header-wrapper" after="navigation.sections"/>
```

---

## 四、HEAD 操作

### default_head_blocks.xml
```xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <head>
        <!-- CSS -->
        <css src="css/styles.css"/>
        <css src="css/print.css" media="print"/>
        
        <!-- JavaScript -->
        <script src="js/custom.js" defer="defer"/>
        
        <!-- 内联 CSS -->
        <css>
            <text>.class { color: red; }</text>
        </css>
        
        <!-- Meta 标签 -->
        <meta name="viewport" content="width=device-width"/>
        
        <!-- Link 标签 -->
        <link src="https://fonts.googleapis.com/css2?family=Inter" 
              src_type="url" 
              rel="stylesheet"/>
        
        <!-- 标题 -->
        <title>Page Title</title>
        
        <!-- 移除资源 -->
        <remove src="css/to-remove.css"/>
    </head>
</page>
```

---

## 五、布局句柄

### 全局句柄
| 句柄 | 说明 |
|------|------|
| `default` | 所有页面 |
| `default_head_blocks` | HEAD 区域 |

### CMS 页面
| 句柄 | 说明 |
|------|------|
| `cms_index_index` | 首页 |
| `cms_page_view` | CMS 页面 |
| `cms_page_view_id_{identifier}` | 特定 CMS 页面 |

### Catalog 页面
| 句柄 | 说明 |
|------|------|
| `catalog_category_view` | 分类页 |
| `catalog_category_view_id_{id}` | 特定分类 |
| `catalog_product_view` | 产品详情页 |
| `catalog_product_view_id_{id}` | 特定产品 |
| `catalogsearch_result_index` | 搜索结果页 |

### Customer 页面
| 句柄 | 说明 |
|------|------|
| `customer_account_login` | 登录页 |
| `customer_account_create` | 注册页 |
| `customer_account_index` | 账户仪表板 |
| `customer_account_edit` | 编辑账户 |

### Checkout 页面
| 句柄 | 说明 |
|------|------|
| `checkout_index_index` | 购物车/结账页 |
| `checkout_onepage_success` | 订单成功页 |

---

## 六、核心容器名称

### 头部容器
```
header.container         - 头部主容器
header.panel             - 顶部栏（语言、货币）
header-wrapper           - Logo、搜索、购物车
navigation.sections      - 导航菜单
```

### 页面容器
```
page.wrapper             - 页面包装器
page.top                 - 页面顶部（面包屑、消息）
main.content             - 主内容区
main                     - 主列
columns.top              - 列顶部
columns                  - 列容器
sidebar.main             - 主侧边栏
sidebar.additional       - 附加侧边栏
```

### 底部容器
```
footer-container         - 底部容器
footer                   - 底部内容
copyright                - 版权信息
```

### 其他容器
```
after.body.start         - body 开始
before.body.end          - body 结束
global.notices           - 全局通知
content                  - 内容区域
```

---

## 七、条件判断

### 产品类型判断
```xml
<referenceBlock name="product.info">
    <action method="setTemplate" ifconfig="section/group/field">
        <argument name="template" xsi:type="string">...</argument>
    </action>
</referenceBlock>
```

---

## 八、数据获取

### 模板中常用方法
```php
// URL
$block->getUrl('module/controller/action');
$block->getBaseUrl();
$block->getMediaUrl();

// 视图文件
$block->getViewFileUrl('images/logo.png');

// 转义
$block->escapeHtml($text);
$block->escapeUrl($url);
$block->escapeJs($js);

// 布局
$block->getLayout();
$block->getChildHtml('child.name');
$block->getBlockHtml('block.name');

// 配置
$block->getConfig('path/to/config');

// Store
$block->getStoreId();
$block->getStoreCode();
```

---

## 九、响应式断点

### Magento 默认断点
```less
@screen__xs: 480px;    // 超小屏幕
@screen__s: 640px;     // 小屏幕
@screen__m: 768px;     // 中屏幕（平板）
@screen__l: 1024px;    // 大屏幕（桌面）
@screen__xl: 1440px;   // 超大屏幕
```

### 使用方法
```less
// 移动端优先
& when (@media-common = true) {
    // 公共样式
}

.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // >= 768px (桌面)
}

.media-width(@extremum, @break) when (@extremum = 'max') and (@break = @screen__m) {
    // < 768px (移动端)
}
```

---

## 十、常用命令

```bash
# 清除缓存
php bin/magento cache:clean

# 清除特定缓存
php bin/magento cache:clean layout block_html

# 部署静态文件
php bin/magento setup:static-content:deploy

# 部署特定主题
php bin/magento setup:static-content:deploy --theme=Folix/game-theme

# 生产模式
php bin/magento deploy:mode:set production

# 开发者模式
php bin/magento deploy:mode:set developer

# 查看已注册主题
php bin/magento dev:theme:list

# 编译 Less
php bin/magento dev:source-theme:deploy
```
