# Folix Game Theme

A modern gaming e-commerce theme for Magento 2.4.8, extending the Luma theme.

## ✨ Features

- **Modern Design**: Gradient color scheme with blue and orange accents
- **Gaming Style**: Game badges, product cards, and gaming-specific UI
- **Responsive**: Fully responsive for all devices
- **Performance**: Optimized CSS using Magento UI Library
- **Standards Compliant**: Follows Magento 2 theming best practices

## 📦 Installation

### Via Composer
```bash
composer require folix/theme-frontend-game
```

### Manual Installation
1. Copy theme to `app/design/frontend/Folix/game-theme/`
2. Run Magento setup:
```bash
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

## ⚙️ Configuration

1. Go to **Admin > Content > Design > Configuration**
2. Select your store view
3. Set **Default Theme** to "Folix Game Theme"
4. Save configuration

## 🎨 Theme Structure

```
Folix/game-theme/
├── web/css/source/
│   ├── _theme.less          # Override Luma variables
│   └── _variables.less       # Custom variables
├── Magento_Theme/
│   ├── web/css/source/
│   │   └── _module.less      # Theme module styles (overrides parent)
│   └── layout/
│       └── default.xml       # Layout extensions
├── Magento_Catalog/
│   └── web/css/source/
│       └── _module.less      # Catalog module styles (overrides parent)
├── etc/view.xml              # Image sizes configuration
├── theme.xml                 # Theme configuration
└── registration.php          # Theme registration
```

## 🔑 Key Concepts

### CSS Loading Order (from Blank theme)

```
styles-m.less:
  _reset.less → _styles.less → @magento_import(_module.less) → _theme.less
                                      ↓
                  Automatically scans all module _module.less files
```

### Two Approaches for `_module.less`

| Approach | Description | When to Use |
|----------|-------------|-------------|
| **Copy & Extend** | Copy all parent variables, then add custom styles | Major style changes |
| **Override Only** | Only override specific CSS rules (requires CSS specificity) | Minor adjustments |

### Important Rules

1. **`_module.less` completely overrides parent theme's `_module.less`**
   - Must copy ALL parent variables before extending
   - Otherwise, parent variables will be undefined

2. **`_theme.less` only overrides variables**
   - Used to change existing variable values
   - Do NOT define new variables here

3. **`_variables.less` defines new variables**
   - All custom theme variables go here
   - Imported in `_module.less`

4. **Do NOT create `styles-m.less` / `styles-l.less`**
   - Inherited from Blank theme automatically

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #4A90E2 | Buttons, links, highlights |
| Secondary Orange | #FF6B35 | CTAs, accents, prices |
| Accent Purple | #6C5CE7 | Gradients |
| Dark Background | #1E293B | Header, footer |

## 🔧 Customization

### Override Colors
Edit `web/css/source/_theme.less`:
```less
@theme__color__primary: #YourColor;
```

### Add Custom Variables
Edit `web/css/source/_variables.less`:
```less
@folix-color-secondary: #YourColor;
```

### Extend Module Styles
Edit `Magento_*/web/css/source/_module.less`:
```less
& when (@media-common = true) {
    .page-header {
        // Your custom styles
    }
}
```

## 📱 Responsive Breakpoints

- **Desktop**: ≥ 768px (`@screen__m`)
- **Mobile**: < 768px

Use `.media-width()` mixin for responsive styles:
```less
.media-width(@extremum, @break) when (@extremum = 'min') and (@break = @screen__m) {
    // Desktop styles
}
```

## 📚 Requirements

- Magento 2.4.8+
- PHP 8.1+
- Composer

## 📄 License

OSL-3.0, AFL-3.0

## 🤝 Support

For issues and feature requests, please create an issue on GitHub.

---

**Version**: 2.0.0  
**Compatibility**: Magento 2.4.8
