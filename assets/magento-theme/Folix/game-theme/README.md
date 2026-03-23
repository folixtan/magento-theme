# Folix Game Theme

A modern gaming e-commerce theme for Magento 2, based on the Luma theme.

## 🎮 Theme Overview

Folix Game Theme is a professionally designed Magento 2 theme tailored for gaming digital goods stores. It features a modern gradient color scheme, responsive design, and game-style product cards.

### ✨ Features

- **Modern Design**: Gradient color scheme with blue and orange accents
- **Two-Row Header**: Professional navigation with search and user actions
- **Game-Style Product Cards**: Customizable badges, prices, and stock status
- **Hero Slider**: Engaging homepage carousel with animations
- **Promotional Banners**: Eye-catching promotional sections
- **Responsive Layout**: Fully responsive for all devices
- **Performance Optimized**: Lazy loading, optimized assets
- **Customizable**: Easy to customize colors, fonts, and layouts

## 📦 Installation

### Via Composer (Recommended)

```bash
composer require folix/theme-frontend-game
```

### Manual Installation

1. Download the theme package
2. Extract to `app/design/frontend/Folix/game-theme/`
3. Run Magento setup commands:

```bash
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

## ⚙️ Configuration

### 1. Apply Theme

1. Go to **Admin > Content > Design > Configuration**
2. Select your store view
3. Change **Default Theme** to "Folix Game Theme"
4. Save configuration

### 2. Upload Logo

1. Go to **Admin > Content > Design > Configuration**
2. Select your store view
3. Upload your logo image (recommended size: 200x40px)
4. Save configuration

### 3. Customize Colors

Edit `web/css/source/_variables.less` to change:

- Primary color: `@theme__color__primary: #4A90E2;`
- Secondary color: `@theme__color__secondary: #FF6B35;`
- Accent color: `@theme__color__primary-alt: #6C5CE7;`

After changes, regenerate CSS:

```bash
php bin/magento setup:static-content:deploy -f
```

## 🎨 Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Blue | #4A90E2 | Buttons, links, highlights |
| Secondary Orange | #FF6B35 | CTAs, accents, prices |
| Accent Purple | #6C5CE7 | Gradients, hover states |
| Dark Background | #1E293B | Header, footer |
| Success Green | #10B981 | Stock status, success messages |
| Warning Yellow | #F59E0B | Warnings, promotions |
| Danger Red | #EF4444 | Errors, out of stock |

## 📁 Theme Structure

```
Folix/game-theme/
├── composer.json                 # Composer configuration
├── registration.php              # Theme registration
├── theme.xml                     # Theme configuration
├── etc/
│   └── view.xml                  # View configuration
├── web/
│   ├── css/
│   │   └── source/
│   │       ├── _variables.less   # Theme variables
│   │       ├── _extend.less      # Main styles
│   │       ├── _buttons.less     # Button styles
│   │       ├── _forms.less       # Form styles
│   │       ├── _header.less      # Header styles
│   │       ├── _footer.less      # Footer styles
│   │       ├── _products.less    # Product styles
│   │       ├── _components.less  # Component styles
│   │       └── _theme.less       # Theme imports
│   ├── js/
│   │   ├── hero-slider.js        # Slider functionality
│   │   ├── navigation-menu.js    # Navigation menu
│   │   ├── product-card.js       # Product cards
│   │   └── theme.js              # Main theme JS
│   └── images/                   # Theme images
├── Magento_Theme/
│   ├── layout/
│   │   ├── default.xml           # Default layout
│   │   └── cms_index_index.xml   # Homepage layout
│   └── templates/
│       └── html/
│           ├── header.phtml      # Header template
│           ├── footer.phtml      # Footer template
│           ├── logo.phtml        # Logo template
│           ├── hero-slider.phtml # Hero slider
│           └── promo-banner.phtml # Promotional banner
├── Magento_Catalog/
│   ├── layout/
│   │   └── default.xml           # Catalog layout
│   └── templates/
│       └── product/
│           ├── list.phtml        # Product list
│           └── image_with_borders.phtml # Product image
├── Magento_Search/
│   └── templates/
│       └── form.mini.phtml       # Search form
└── media/
    └── preview.svg               # Theme preview
```

## 🔧 Customization

### Adding Custom CSS

1. Create a new Less file in `web/css/source/`
2. Import it in `_theme.less`:
   ```less
   @import '_custom.less';
   ```
3. Run static content deployment

### Adding Custom JavaScript

1. Add your JS file to `web/js/`
2. Register it in `requirejs-config.js`:
   ```javascript
   var config = {
       map: {
           '*': {
               'customJs': 'Folix_GameTheme/js/custom'
           }
       }
   };
   ```

### Overriding Templates

To override any Magento template:

1. Find the original template path
2. Create the same directory structure in your theme
3. Copy and modify the template

Example:
```
Original: vendor/magento/module-catalog/view/frontend/templates/product/list.phtml
Override: app/design/frontend/Folix/game-theme/Magento_Catalog/templates/product/list.phtml
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 640px - 768px
- **Mobile**: < 640px

## 🚀 Performance Tips

1. **Enable Production Mode**:
   ```bash
   php bin/magento deploy:mode:set production
   ```

2. **Merge CSS/JS**:
   Go to **Admin > Stores > Configuration > Advanced > Developer**
   - Merge CSS Files: Yes
   - Merge JavaScript Files: Yes

3. **Enable Caching**:
   ```bash
   php bin/magento cache:enable
   ```

4. **Optimize Images**:
   - Use WebP format when possible
   - Compress images before upload

## 🐛 Troubleshooting

### Theme Not Showing

1. Clear cache: `php bin/magento cache:flush`
2. Re-deploy static content: `php bin/magento setup:static-content:deploy -f`
3. Check file permissions

### CSS Not Loading

1. Clear generated static files: `rm -rf pub/static/*`
2. Re-deploy static content
3. Check `.less` file syntax

### JavaScript Errors

1. Check browser console for errors
2. Verify RequireJS configuration
3. Clear browser cache

## 📄 License

This theme is licensed under OSL-3.0 and AFL-3.0.

## 🤝 Support

For support, please contact:
- Email: support@folix-game.com
- Website: https://folix-game.com/support

## 🙏 Credits

- Based on Magento Luma Theme
- Icons: Emoji Icons
- Fonts: Open Sans

---

**Version**: 1.0.0  
**Compatibility**: Magento 2.4.x  
**Last Updated**: 2026
