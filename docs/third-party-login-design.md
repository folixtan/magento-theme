# Folix Game Theme - 第三方登录集成方案

## 一、概述

### 目标
集成 Google 登录，提供流畅的用户体验，与现有登录下拉菜单无缝整合。

### 技术选型
- **Google 登录**: 使用 Google Identity Services (GIS) - OAuth 2.0
- **Magento 集成**: 通过自定义模块实现第三方账户绑定

---

## 二、用户流程设计

### 2.1 登录流程

```
┌─────────────────────────────────────────────────────────────────┐
│                     第三方登录流程图                              │
└─────────────────────────────────────────────────────────────────┘

用户点击 "Google" 按钮
        │
        ▼
┌───────────────────┐
│  检测是否已登录？  │
└───────────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
  否        是
   │         │
   ▼         │
┌────────────────────────────────────────┐
│         弹出 Google OAuth 授权窗口        │
│  ┌──────────────────────────────────┐  │
│  │  选择 Google 账户                 │  │
│  │  授权应用访问基本信息              │  │
│  │  (email, profile)                │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
        │
        ▼
┌───────────────────┐
│  Google 返回授权码  │
│  + ID Token        │
└───────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│     前端发送 Token 到后端验证             │
│     POST /social/login/google            │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│          后端处理逻辑                     │
│  1. 验证 Google Token                    │
│  2. 获取用户信息 (email, name, avatar)   │
│  3. 查询是否已绑定 Magento 账户           │
└─────────────────────────────────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
已绑定      未绑定
   │         │
   │         ▼
   │    ┌─────────────────────────────────┐
   │    │  显示账户关联/注册表单            │
   │    │  ┌──────────────────────────┐   │
   │    │  │ 邮箱: user@gmail.com     │   │
   │    │  │ (来自 Google，不可修改)   │   │
   │    │  ├──────────────────────────┤   │
   │    │  │ ☑ 自动创建新账户          │   │
   │    │  │ 或                       │   │
   │    │  │ ☐ 关联现有账户            │   │
   │    │  │   [输入密码验证]          │   │
   │    │  └──────────────────────────┘   │
   │    └─────────────────────────────────┘
   │         │
   │         ▼
   │    创建/关联账户
   │         │
   └────┬────┘
        │
        ▼
┌─────────────────────────────────────────┐
│          登录成功                         │
│  - 设置 Magento Session                  │
│  - 关闭登录面板                           │
│  - 更新顶部用户状态                       │
│  - 跳转到之前页面或首页                   │
└─────────────────────────────────────────┘
```

### 2.2 账户绑定流程

```
┌─────────────────────────────────────────────────────────────────┐
│                   账户绑定流程                                    │
└─────────────────────────────────────────────────────────────────┘

场景1: Google 邮箱已存在于 Magento
        │
        ▼
┌─────────────────────────────────┐
│  检测到邮箱匹配: user@gmail.com  │
│                                 │
│  该邮箱已注册，请选择：          │
│  ┌───────────────────────────┐  │
│  │ ☑ 一键关联                 │  │
│  │   使用 Google 验证身份     │  │
│  │   直接登录                 │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ ☐ 密码验证                 │  │
│  │   输入现有账户密码确认      │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

场景2: Google 邮箱不存在于 Magento
        │
        ▼
┌─────────────────────────────────┐
│  新用户注册                      │
│                                 │
│  使用 Google 信息自动填充：      │
│  ┌───────────────────────────┐  │
│  │ 姓名: John Doe (来自Google)│  │
│  │ 邮箱: john@gmail.com      │  │
│  │ 头像: [Google Avatar]     │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] 我同意服务条款              │
│                                 │
│  [完成注册并登录]                │
└─────────────────────────────────┘
```

---

## 三、UI 设计

### 3.1 登录下拉菜单 - 第三方登录区域

```
┌─────────────────────────────────────────┐
│  [登录] [注册]                           │  ← Tab 切换
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📧 Email Address                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 🔒 Password                       │  │
│  └───────────────────────────────────┘  │
│                                         │
│                      忘记密码?           │
│  ┌───────────────────────────────────┐  │
│  │          登 录                     │  │  ← 主按钮（渐变色）
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── 或使用以下方式登录 ────────  │
│                                         │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │  🔴 Google      │ │  🔵 Facebook  │  │  ← 第三方登录按钮
│  └─────────────────┘ └───────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Google 登录按钮样式

```css
/* 按钮 Hover 效果 */
.btn-google {
    /* 默认状态 */
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    color: #1E293B;
}

.btn-google:hover {
    /* Hover 状态 */
    background: #F8FAFC;
    border-color: #4285F4;
    color: #4285F4;
    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15);
}

/* 点击加载状态 */
.btn-google.loading {
    position: relative;
    pointer-events: none;
}

.btn-google.loading::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid #E2E8F0;
    border-top-color: #4285F4;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
```

### 3.3 账户关联弹窗

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     👤 John Doe                                        │  │
│  │     john.doe@gmail.com                                 │  │
│  │     ───────────────────────────────                    │  │
│  │     首次使用 Google 登录                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  该邮箱已存在于我们的系统                                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ☑ 一键关联账户                                        │  │
│  │    使用 Google 身份验证，快速登录                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ☐ 验证现有账户密码                                    │  │
│  │    ┌─────────────────────────────────────────────┐    │  │
│  │    │ 🔒 输入密码                                  │    │  │
│  │    └─────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              确认并登录                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、技术实现

### 4.1 前端实现

#### Step 1: 加载 Google Identity Services

```html
<!-- 在 default.xml layout 中添加 -->
<referenceContainer name="head.additional">
    <block class="Magento\Framework\View\Element\Template" name="google.signin.script">
        <arguments>
            <argument name="template" xsi:type="string">Magento_Theme::html/head/google-signin.phtml</argument>
        </arguments>
    </block>
</referenceContainer>
```

```html
<!-- google-signin.phtml -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<meta name="google-signin-client_id" content="<?= $block->escapeHtmlAttr($block->getGoogleClientId()) ?>" />
```

#### Step 2: 创建 Social Login JS 组件

```javascript
// web/js/social-login.js
define([
    'jquery',
    'mage/translate',
    'mage/loader',
    'Magento_Customer/js/customer-data'
], function ($, $t, loader, customerData) {
    'use strict';

    return function (config) {
        var googleClientId = config.googleClientId;
        var loginUrl = config.loginUrl;
        var bindUrl = config.bindUrl;

        /**
         * 初始化 Google Sign In
         */
        function initGoogleSignIn() {
            if (typeof google === 'undefined' || !google.accounts) {
                console.error('Google Identity Services not loaded');
                return;
            }

            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCredential,
                auto_select: false,
                cancel_on_tap_outside: true
            });
        }

        /**
         * 处理 Google 登录回调
         */
        function handleGoogleCredential(response) {
            var $btn = $('.btn-google');
            
            // 显示加载状态
            $btn.addClass('loading');
            
            // 发送到后端验证
            $.ajax({
                url: loginUrl,
                type: 'POST',
                dataType: 'json',
                data: {
                    credential: response.credential,
                    form_key: $.mage.cookies.get('form_key')
                },
                success: function (result) {
                    if (result.success) {
                        // 登录成功
                        handleLoginSuccess(result);
                    } else if (result.requires_bind) {
                        // 需要绑定账户
                        showBindModal(result);
                    } else {
                        // 显示错误
                        showError(result.message || $t('Login failed'));
                    }
                },
                error: function () {
                    showError($t('Network error, please try again'));
                },
                complete: function () {
                    $btn.removeClass('loading');
                }
            });
        }

        /**
         * 触发 Google 登录
         */
        function triggerGoogleLogin() {
            if (typeof google === 'undefined') {
                showError($t('Google Sign In is not available'));
                return;
            }

            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    // 使用弹窗模式
                    google.accounts.id.prompt();
                }
            });
        }

        /**
         * 显示账户绑定弹窗
         */
        function showBindModal(data) {
            var modalHtml = buildBindModalHtml(data);
            
            $(modalHtml).modal({
                type: 'popup',
                responsive: true,
                modalClass: 'social-bind-modal',
                buttons: []
            }).modal('openModal');
        }

        /**
         * 处理登录成功
         */
        function handleLoginSuccess(result) {
            // 关闭登录下拉菜单
            $('.login-dropdown').removeClass('open');
            
            // 更新客户数据
            customerData.reload(['customer'], true);
            
            // 显示成功提示
            showSuccess($t('Login successful'));
            
            // 跳转或刷新
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                window.location.reload();
            }
        }

        /**
         * 显示错误提示
         */
        function showError(message) {
            // 使用 Magento 的消息组件
            customerData.set('messages', {
                messages: [{
                    type: 'error',
                    text: message
                }]
            });
        }

        /**
         * 显示成功提示
         */
        function showSuccess(message) {
            customerData.set('messages', {
                messages: [{
                    type: 'success',
                    text: message
                }]
            });
        }

        /**
         * 构建绑定弹窗 HTML
         */
        function buildBindModalHtml(data) {
            return `
                <div class="social-bind-content">
                    <div class="user-info">
                        <img src="${data.avatar}" alt="" class="avatar">
                        <div class="details">
                            <strong>${data.name}</strong>
                            <span>${data.email}</span>
                        </div>
                    </div>
                    
                    ${data.accountExists ? `
                        <p class="bind-message">${$t('This email is already registered. Choose how to continue:')}</p>
                        
                        <div class="bind-options">
                            <label class="bind-option">
                                <input type="radio" name="bind_type" value="auto" checked>
                                <span class="option-content">
                                    <strong>${$t('One-click bind')}</strong>
                                    <small>${$t('Use Google identity to verify')}</small>
                                </span>
                            </label>
                            <label class="bind-option">
                                <input type="radio" name="bind_type" value="password">
                                <span class="option-content">
                                    <strong>${$t('Verify with password')}</strong>
                                    <input type="password" class="password-input" placeholder="${$t('Enter your password')}">
                                </span>
                            </label>
                        </div>
                    ` : `
                        <p class="bind-message">${$t('New user? Create account with Google info:')}</p>
                        <div class="new-user-form">
                            <label class="checkbox">
                                <input type="checkbox" name="agree" required>
                                <span>${$t('I agree to the Terms of Service')}</span>
                            </label>
                        </div>
                    `}
                    
                    <button class="action primary confirm-bind">
                        <span>${$t('Confirm and Login')}</span>
                    </button>
                </div>
            `;
        }

        // 初始化
        $(document).ready(function () {
            initGoogleSignIn();
            
            // 绑定点击事件
            $(document).on('click', '.btn-google', function (e) {
                e.preventDefault();
                triggerGoogleLogin();
            });
        });

        return {
            triggerGoogleLogin: triggerGoogleLogin
        };
    };
});
```

#### Step 3: 更新 PHTML 模板

```html
<!-- 在 login-dropdown.phtml 中添加 -->
<div class="social-buttons">
    <button type="button" class="btn-social btn-google"
            data-mage-init='{"Magento_Theme/js/social-login": {
                "googleClientId": "<?= $block->escapeJs($block->getGoogleClientId()) ?>",
                "loginUrl": "<?= $block->escapeUrl($block->getUrl('social/login/google')) ?>",
                "bindUrl": "<?= $block->escapeUrl($block->getUrl('social/login/bind')) ?>"
            }}'>
        <svg width="20" height="20" viewBox="0 0 24 24">
            <!-- Google Logo SVG -->
        </svg>
        <span>Google</span>
    </button>
    <button type="button" class="btn-social btn-facebook">
        <!-- Facebook 按钮暂时保留，后续集成 -->
        <svg>...</svg>
        <span>Facebook</span>
    </button>
</div>
```

### 4.2 后端实现（Magento 模块）

#### 模块结构

```
Folix/
└── SocialLogin/
    ├── etc/
    │   ├── module.xml
    │   ├── config.xml
    │   ├── routes.xml
    │   └── di.xml
    ├── Controller/
    │   └── Login/
    │       ├── Google.php        # Google 登录处理
    │       └── Bind.php          # 账户绑定处理
    ├── Model/
    │   ├── GoogleClient.php      # Google API 客户端
    │   ├── AccountService.php    # 账户服务
    │   └── SocialCustomer.php    # 社交客户模型
    ├── Helper/
    │   └── Data.php              # 配置助手
    ├── etc/adminhtml/
    │   ├── system.xml            # 后台配置
    │   └── routes.xml
    └── view/frontend/
        ├── layout/
        │   └── folix_social_login.xml
        └── web/
            ├── js/
            │   └── social-login.js
            └── css/
                └── source/
                    └── _social-login.less
```

#### 核心控制器

```php
<?php
// Controller/Login/Google.php
namespace Folix\SocialLogin\Controller\Login;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Folix\SocialLogin\Model\GoogleClient;
use Folix\SocialLogin\Model\AccountService;

class Google implements HttpPostActionInterface
{
    private RequestInterface $request;
    private JsonFactory $resultJsonFactory;
    private GoogleClient $googleClient;
    private AccountService $accountService;

    public function __construct(
        RequestInterface $request,
        JsonFactory $resultJsonFactory,
        GoogleClient $googleClient,
        AccountService $accountService
    ) {
        $this->request = $request;
        $this->resultJsonFactory = $resultJsonFactory;
        $this->googleClient = $googleClient;
        $this->accountService = $accountService;
    }

    public function execute()
    {
        $result = $this->resultJsonFactory->create();
        $credential = $this->request->getParam('credential');

        try {
            // 1. 验证 Google Token
            $googleUser = $this->googleClient->verifyCredential($credential);

            if (!$googleUser) {
                return $result->setData([
                    'success' => false,
                    'message' => __('Invalid Google credential')
                ]);
            }

            // 2. 查找或创建客户
            $socialCustomer = $this->accountService->findSocialCustomer(
                'google',
                $googleUser['sub']
            );

            if ($socialCustomer) {
                // 已绑定 - 直接登录
                $customer = $this->accountService->loginCustomer($socialCustomer->getCustomerId());
                
                return $result->setData([
                    'success' => true,
                    'redirectUrl' => $this->getRedirectUrl()
                ]);
            }

            // 3. 检查邮箱是否已存在
            $existingCustomer = $this->accountService->findCustomerByEmail($googleUser['email']);

            if ($existingCustomer) {
                // 邮箱存在 - 需要绑定
                return $result->setData([
                    'success' => false,
                    'requires_bind' => true,
                    'accountExists' => true,
                    'email' => $googleUser['email'],
                    'name' => $googleUser['name'],
                    'avatar' => $googleUser['picture'] ?? '',
                    'googleId' => $googleUser['sub'],
                    'credential' => $credential
                ]);
            }

            // 4. 新用户 - 显示注册选项
            return $result->setData([
                'success' => false,
                'requires_bind' => true,
                'accountExists' => false,
                'email' => $googleUser['email'],
                'name' => $googleUser['name'],
                'avatar' => $googleUser['picture'] ?? '',
                'googleId' => $googleUser['sub'],
                'credential' => $credential
            ]);

        } catch (\Exception $e) {
            return $result->setData([
                'success' => false,
                'message' => __($e->getMessage())
            ]);
        }
    }
}
```

#### 账户服务

```php
<?php
// Model/AccountService.php
namespace Folix\SocialLogin\Model;

use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Customer\Model\CustomerFactory;
use Magento\Framework\Math\Random;

class AccountService
{
    private CustomerRepositoryInterface $customerRepository;
    private CustomerSession $customerSession;
    private CustomerFactory $customerFactory;
    private Random $random;
    private SocialCustomerFactory $socialCustomerFactory;
    private SocialCustomerResource $socialCustomerResource;

    /**
     * 查找社交账户绑定
     */
    public function findSocialCustomer(string $provider, string $providerId): ?SocialCustomer
    {
        $socialCustomer = $this->socialCustomerFactory->create();
        $this->socialCustomerResource->loadByProvider($socialCustomer, $provider, $providerId);
        
        return $socialCustomer->getId() ? $socialCustomer : null;
    }

    /**
     * 通过邮箱查找客户
     */
    public function findCustomerByEmail(string $email): ?\Magento\Customer\Api\Data\CustomerInterface
    {
        try {
            return $this->customerRepository->get($email);
        } catch (\Magento\Framework\Exception\NoSuchEntityException $e) {
            return null;
        }
    }

    /**
     * 登录客户
     */
    public function loginCustomer(int $customerId): void
    {
        $customer = $this->customerRepository->getById($customerId);
        $this->customerSession->setCustomerDataAsLoggedIn($customer);
    }

    /**
     * 创建新客户（从社交账户）
     */
    public function createCustomerFromSocial(
        string $email,
        string $firstName,
        string $lastName,
        string $provider,
        string $providerId,
        ?string $avatar = null
    ): int {
        // 创建客户
        $customer = $this->customerFactory->create();
        $customer->setEmail($email);
        $customer->setFirstname($firstName);
        $customer->setLastname($lastName);
        $customer->setConfirmation(null); // 无需邮箱验证
        $customer->save();

        // 保存社交账户绑定
        $socialCustomer = $this->socialCustomerFactory->create();
        $socialCustomer->setCustomerId($customer->getId());
        $socialCustomer->setProvider($provider);
        $socialCustomer->setProviderId($providerId);
        $socialCustomer->setAvatar($avatar);
        $this->socialCustomerResource->save($socialCustomer);

        return $customer->getId();
    }

    /**
     * 绑定社交账户到现有客户
     */
    public function bindSocialAccount(
        int $customerId,
        string $provider,
        string $providerId,
        ?string $avatar = null
    ): void {
        $socialCustomer = $this->socialCustomerFactory->create();
        $socialCustomer->setCustomerId($customerId);
        $socialCustomer->setProvider($provider);
        $socialCustomer->setProviderId($providerId);
        $socialCustomer->setAvatar($avatar);
        $this->socialCustomerResource->save($socialCustomer);
    }
}
```

### 4.3 数据库结构

```sql
-- 社交账户绑定表
CREATE TABLE `folix_social_customer` (
    `entity_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` INT UNSIGNED NOT NULL,
    `provider` VARCHAR(32) NOT NULL COMMENT 'google, facebook, etc',
    `provider_id` VARCHAR(255) NOT NULL COMMENT 'Provider user ID',
    `avatar` VARCHAR(512) NULL COMMENT 'Avatar URL from provider',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`entity_id`),
    UNIQUE KEY `UNQ_PROVIDER_ID` (`provider`, `provider_id`),
    KEY `IDX_CUSTOMER_ID` (`customer_id`),
    CONSTRAINT `FK_SOCIAL_CUSTOMER_ID` 
        FOREIGN KEY (`customer_id`) 
        REFERENCES `customer_entity` (`entity_id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Social account bindings';
```

---

## 五、后台配置

### 5.1 系统配置 (system.xml)

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Config:etc/system_file.xsd">
    <system>
        <section id="folix_social" translate="label" type="text" sortOrder="100" showInDefault="1" showInWebsite="1" showInStore="1">
            <label>Social Login</label>
            <tab>folix</tab>
            <resource>Folix_SocialLogin::config</resource>
            
            <group id="google" translate="label" type="text" sortOrder="10" showInDefault="1" showInWebsite="1" showInStore="1">
                <label>Google Sign In</label>
                
                <field id="enabled" translate="label" type="select" sortOrder="10" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Enable Google Sign In</label>
                    <source_model>Magento\Config\Model\Config\Source\Yesno</source_model>
                </field>
                
                <field id="client_id" translate="label" type="text" sortOrder="20" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Google Client ID</label>
                    <comment>Get from Google Cloud Console</comment>
                    <depends>
                        <field id="enabled">1</field>
                    </depends>
                </field>
                
                <field id="button_style" translate="label" type="select" sortOrder="30" showInDefault="1" showInWebsite="1" showInStore="0">
                    <label>Button Style</label>
                    <source_model>Folix\SocialLogin\Model\Config\Source\ButtonStyle</source_model>
                    <depends>
                        <field id="enabled">1</field>
                    </depends>
                </field>
            </group>
            
            <group id="facebook" translate="label" type="text" sortOrder="20" showInDefault="1" showInWebsite="1" showInStore="1">
                <label>Facebook Login</label>
                
                <field id="enabled" translate="label" type="select" sortOrder="10" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Enable Facebook Login</label>
                    <source_model>Magento\Config\Model\Config\Source\Yesno</source_model>
                </field>
                
                <field id="app_id" translate="label" type="text" sortOrder="20" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Facebook App ID</label>
                    <depends>
                        <field id="enabled">1</field>
                    </depends>
                </field>
            </group>
        </section>
    </system>
</config>
```

---

## 六、Google Cloud Console 配置步骤

### 6.1 创建 OAuth 2.0 凭据

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API" 或 "People API"
4. 转到 "凭据" → "创建凭据" → "OAuth 2.0 客户端 ID"
5. 应用类型选择 "Web 应用"
6. 添加授权重定向 URI：
   - `https://yourdomain.com/social/login/google/callback`
   - `https://yourdomain.com/` (前端)

### 6.2 配置 OAuth 同意屏幕

1. 设置应用名称：`Folix Game Store`
2. 设置应用 Logo
3. 授权域名
4. 请求的 Scopes：
   - `email` (必需)
   - `profile` (必需)
   - `openid` (必需)

---

## 七、样式设计

### 7.1 社交登录样式 (_social-login.less)

```less
// web/css/source/extends/_social-login.less

& when (@media-common = true) {
    
    //
    //  Social Login Buttons
    //  _____________________________________________
    
    .social-login {
        
        .social-buttons {
            display: flex;
            gap: 12px;
        }
        
        .btn-social {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            background: @folix-bg-card;
            border: 2px solid @folix-border;
            border-radius: @folix-radius;
            font-size: 14px;
            font-weight: 600;
            color: @folix-text-primary;
            cursor: pointer;
            transition: all 0.3s ease;
            
            svg {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
            }
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            
            &.loading {
                pointer-events: none;
                opacity: 0.7;
                
                &::after {
                    content: '';
                    width: 16px;
                    height: 16px;
                    border: 2px solid @folix-border;
                    border-top-color: currentColor;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
            }
        }
        
        // Google Button
        .btn-google {
            &:hover {
                background: #FFFFFF;
                border-color: #4285F4;
                color: #4285F4;
                box-shadow: 0 6px 20px rgba(66, 133, 244, 0.2);
            }
        }
        
        // Facebook Button
        .btn-facebook {
            &:hover {
                background: #FFFFFF;
                border-color: #1877F2;
                color: #1877F2;
                box-shadow: 0 6px 20px rgba(24, 119, 242, 0.2);
            }
        }
    }
    
    //
    //  Social Bind Modal
    //  _____________________________________________
    
    .social-bind-modal {
        
        .modal-inner-wrap {
            max-width: 440px;
            border-radius: @folix-radius-lg;
        }
        
        .social-bind-content {
            padding: 24px;
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: @folix-bg-page;
                border-radius: @folix-radius;
                margin-bottom: 20px;
                
                .avatar {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .details {
                    strong {
                        display: block;
                        font-size: 16px;
                        color: @folix-text-primary;
                    }
                    
                    span {
                        font-size: 13px;
                        color: @folix-text-muted;
                    }
                }
            }
            
            .bind-message {
                margin-bottom: 16px;
                color: @folix-text-secondary;
            }
            
            .bind-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
                
                .bind-option {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    background: @folix-bg-card;
                    border: 2px solid @folix-border;
                    border-radius: @folix-radius;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    
                    &:hover {
                        border-color: @folix-primary;
                    }
                    
                    input[type="radio"] {
                        margin-top: 4px;
                        
                        &:checked + .option-content {
                            color: @folix-primary;
                        }
                    }
                    
                    .option-content {
                        flex: 1;
                        
                        strong {
                            display: block;
                            margin-bottom: 4px;
                        }
                        
                        small {
                            color: @folix-text-muted;
                        }
                    }
                    
                    .password-input {
                        width: 100%;
                        margin-top: 8px;
                        padding: 10px 12px;
                        border: 1px solid @folix-border;
                        border-radius: @folix-radius-sm;
                        font-size: 14px;
                    }
                }
            }
            
            .new-user-form {
                margin-bottom: 20px;
                
                .checkbox {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    cursor: pointer;
                    
                    input {
                        margin-top: 4px;
                    }
                    
                    span {
                        font-size: 13px;
                        color: @folix-text-secondary;
                        
                        a {
                            color: @folix-primary;
                        }
                    }
                }
            }
            
            .confirm-bind {
                width: 100%;
                padding: 14px 24px;
                background: @folix-gradient-primary;
                color: white;
                border: none;
                border-radius: @folix-radius;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.3);
                }
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
```

---

## 八、安全考虑

### 8.1 Token 验证
- 始终在后端验证 Google ID Token
- 使用 Google 公钥验证签名
- 检查 Token 过期时间
- 验证 `aud` (Client ID) 匹配

### 8.2 防止攻击
- CSRF 保护：使用 Magento Form Key
- 速率限制：限制登录尝试次数
- 日志记录：记录所有社交登录尝试

### 8.3 数据保护
- 不存储敏感的 OAuth Token
- 只存储必要的用户信息
- 符合 GDPR 要求：用户可删除社交绑定

---

## 九、实现优先级

### Phase 1: 核心功能 (Week 1)
- [ ] 创建 `Folix_SocialLogin` 模块骨架
- [ ] 实现 Google Client ID 后台配置
- [ ] 前端 Google Sign In 集成
- [ ] 后端 Token 验证
- [ ] 自动注册/登录流程

### Phase 2: 账户绑定 (Week 2)
- [ ] 数据库表创建
- [ ] 账户绑定弹窗 UI
- [ ] 密码验证流程
- [ ] 绑定关系管理

### Phase 3: 优化与扩展 (Week 3)
- [ ] 错误处理优化
- [ ] 日志记录
- [ ] Facebook 登录集成
- [ ] 用户头像同步

---

## 十、测试清单

### 功能测试
- [ ] 首次 Google 登录 → 自动创建账户
- [ ] 已绑定账户 → 直接登录
- [ ] 邮箱已存在 → 显示绑定选项
- [ ] 密码验证 → 成功绑定
- [ ] 密码验证 → 失败提示
- [ ] 取消授权 → 返回登录页
- [ ] 网络错误 → 友好提示

### 兼容性测试
- [ ] Chrome / Firefox / Safari
- [ ] iOS Safari / Android Chrome
- [ ] 微信内置浏览器
- [ ] 无痕模式

### 安全测试
- [ ] 无效 Token 拒绝
- [ ] 过期 Token 拒绝
- [ ] CSRF 防护
- [ ] 速率限制
