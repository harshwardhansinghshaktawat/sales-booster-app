class BundleBuilderElement extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.bundleProducts = [];
    this.selectedBundles = new Set();
    this.quantity = 1;
    this.currentImageIndex = 0;
    this.currentStep = 'product';
    
    this.styleProps = {
      color1: '#ffffff',
      color2: '#f8f9fa',
      color3: '#e5e7eb',
      color4: '#3b82f6',
      color5: '#2563eb',
      color6: '#1f2937',
      color7: '#6b7280',
      color8: '#111827',
      color9: '#10b981',
      color10: '#ef4444',
      color11: 'rgba(0,0,0,0.1)',
      color12: '#fbbf24',
      color13: '#8b5cf6',
      slider1: '12',
      slider2: '16',
      slider3: '16',
      slider4: '10',
      slider5: '15',
      slider6: '20',
      slider7: '25',
      text1: 'Premium Product',
      text2: 'Experience Excellence',
      text3: 'Continue to Bundle Builder',
      text4: 'Premium Quality',
      text5: 'Crafted with care',
      text6: 'Fast Shipping',
      text7: 'Quick delivery',
      text8: '30-Day Returns',
      text9: 'Risk-free guarantee',
      text10: '🎁 Build Your Bundle & Save Big!',
      text11: 'Select complementary items and unlock progressive discounts',
      text12: 'Complete My Bundle',
      text13: 'Skip Bundle Builder',
      text14: 'Perfect Matches',
      text15: '⭐ Most customers choose 3 items (15% OFF)',
      text16: '🔥 VIP customers save 25%+ on bundles',
      text17: 'Bundle Discounts',
      text18: '💰 Your Savings Meter',
      text19: 'Add 1 more item to unlock the next tier!',
      text20: 'Bundle & Save',
      text21: 'Current Total',
      text22: 'Bundle Discount',
      text23: 'You Pay',
      dropdown1: 'modernBlue'
    };
    
    this.selectedOptions = {};
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['product-data', 'bundle-data', 'style-props', 'funnel-action'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'product-data' && newVal && newVal !== oldVal) {
      try {
        this.product = JSON.parse(newVal);
        this.selectedOptions = {};
        this.quantity = 1;
        this.currentStep = 'product';
        this.render();
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    }
    
    if (name === 'bundle-data' && newVal && newVal !== oldVal) {
      try {
        this.bundleProducts = JSON.parse(newVal);
      } catch (error) {
        console.error('Error parsing bundle data:', error);
        this.bundleProducts = [];
      }
    }
    
    if (name === 'style-props' && newVal && newVal !== oldVal) {
      try {
        const newStyleProps = JSON.parse(newVal);
        this.styleProps = { ...this.styleProps, ...newStyleProps };
        this.updateStyles();
      } catch (error) {
        console.error('Error parsing style props:', error);
      }
    }
    
    if (name === 'funnel-action' && newVal) {
      if (oldVal !== newVal) {
        const actionType = newVal.split('-').slice(0, -1).join('-') || newVal;
        
        if (actionType === 'show-bundle-builder') {
          this.showBundleBuilder();
        }
        
        this.removeAttribute('funnel-action');
      }
    }
  }

  updateStyles() {
    const styleElement = this.querySelector('style');
    if (styleElement) {
      styleElement.textContent = this.getStyles();
    }
  }

  getStyles() {
    const {
      color1, color2, color3, color4, color5, color6, color7, color8,
      color9, color10, color11, color12, color13,
      slider1, slider2, slider3
    } = this.styleProps;

    const radius = parseInt(slider1);
    const spacing = parseInt(slider2);
    const fontSize = parseInt(slider3);

    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      .funnel-container {
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(135deg, ${color2} 0%, ${color1} 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: ${spacing * 2}px;
      }
      
      .hidden {
        display: none !important;
      }
      
      /* Product Step - Same as coupon funnel */
      .product-step {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .product-header {
        text-align: center;
        margin-bottom: ${spacing * 3}px;
        animation: fadeInDown 0.6s ease;
      }
      
      .product-title {
        font-size: ${fontSize * 3}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing}px;
        letter-spacing: -1px;
      }
      
      .product-subtitle {
        font-size: ${fontSize + 4}px;
        color: ${color7};
        margin-bottom: ${spacing * 2}px;
      }
      
      .product-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${spacing * 3}px;
        background: ${color1};
        padding: ${spacing * 3}px;
        border-radius: ${radius * 2}px;
        box-shadow: 0 20px 60px ${color11};
        animation: fadeInUp 0.8s ease;
      }
      
      .product-gallery {
        position: relative;
      }
      
      .main-image-container {
        position: relative;
        width: 100%;
        padding-top: 100%;
        background: ${color2};
        border-radius: ${radius}px;
        overflow: hidden;
        margin-bottom: ${spacing}px;
      }
      
      .main-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.5s ease;
      }
      
      .thumbnail-gallery {
        display: flex;
        gap: ${spacing}px;
        overflow-x: auto;
      }
      
      .thumbnail {
        min-width: 80px;
        height: 80px;
        border: 3px solid transparent;
        border-radius: ${radius}px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .thumbnail:hover {
        border-color: ${color4};
        transform: scale(1.05);
      }
      
      .thumbnail.active {
        border-color: ${color4};
        box-shadow: 0 0 0 3px ${color4}30;
      }
      
      .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .product-details {
        display: flex;
        flex-direction: column;
      }
      
      .product-name {
        font-size: ${fontSize * 2}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing}px;
      }
      
      .product-price {
        font-size: ${fontSize * 2.5}px;
        font-weight: 800;
        color: ${color8};
        margin-bottom: ${spacing * 2}px;
      }
      
      .product-description {
        font-size: ${fontSize}px;
        color: ${color7};
        line-height: 1.8;
        margin-bottom: ${spacing * 2}px;
        padding-bottom: ${spacing * 2}px;
        border-bottom: 2px solid ${color3};
      }
      
      .option-group {
        margin-bottom: ${spacing * 2}px;
      }
      
      .option-label {
        display: block;
        font-weight: 700;
        font-size: ${fontSize - 1}px;
        color: ${color6};
        margin-bottom: ${spacing}px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .color-swatches {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      
      .color-swatch {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid ${color3};
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        box-shadow: 0 2px 8px ${color11};
      }
      
      .color-swatch:hover {
        transform: scale(1.15);
        border-color: ${color4};
      }
      
      .color-swatch.selected {
        border-color: ${color4};
        box-shadow: 0 0 0 3px ${color1}, 0 0 0 6px ${color4};
        transform: scale(1.1);
      }
      
      .size-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      
      .size-button {
        padding: 12px 24px;
        border: 2px solid ${color3};
        background: ${color1};
        border-radius: ${radius}px;
        font-size: ${fontSize}px;
        font-weight: 600;
        color: ${color6};
        cursor: pointer;
        transition: all 0.3s;
        min-width: 70px;
        text-align: center;
      }
      
      .size-button:hover {
        border-color: ${color4};
        background: ${color4}10;
        transform: translateY(-2px);
      }
      
      .size-button.selected {
        border-color: ${color4};
        background: ${color4};
        color: ${color1};
        box-shadow: 0 4px 12px ${color4}40;
      }
      
      .dropdown-select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid ${color3};
        border-radius: ${radius}px;
        font-size: ${fontSize}px;
        color: ${color6};
        background: ${color1};
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 500;
      }
      
      .dropdown-select:hover,
      .dropdown-select:focus {
        border-color: ${color4};
        outline: none;
        box-shadow: 0 0 0 4px ${color4}20;
      }
      
      .quantity-selector {
        display: flex;
        align-items: center;
        gap: ${spacing}px;
        margin: ${spacing * 2}px 0;
      }
      
      .quantity-label {
        font-weight: 700;
        font-size: ${fontSize}px;
        color: ${color6};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        background: ${color2};
        padding: 8px 16px;
        border-radius: ${radius}px;
        border: 2px solid ${color3};
      }
      
      .quantity-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: ${color1};
        border-radius: ${radius / 2}px;
        font-size: 20px;
        font-weight: 700;
        color: ${color6};
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .quantity-btn:hover:not(:disabled) {
        background: ${color4};
        color: ${color1};
        transform: scale(1.1);
      }
      
      .quantity-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      
      .quantity-value {
        min-width: 40px;
        text-align: center;
        font-size: ${fontSize + 4}px;
        font-weight: 800;
        color: ${color6};
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${spacing}px;
        margin: ${spacing * 2}px 0;
        padding: ${spacing * 2}px 0;
        border-top: 2px solid ${color3};
      }
      
      .feature-item {
        text-align: center;
        padding: ${spacing}px;
        background: ${color2};
        border-radius: ${radius}px;
        transition: all 0.3s;
      }
      
      .feature-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px ${color11};
      }
      
      .feature-title {
        font-size: ${fontSize - 1}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: 4px;
      }
      
      .feature-text {
        font-size: ${fontSize - 2}px;
        color: ${color7};
      }
      
      .cta-button {
        width: 100%;
        padding: ${spacing + 4}px ${spacing * 3}px;
        background: ${color4};
        color: ${color1};
        border: none;
        border-radius: ${radius * 2}px;
        font-size: ${fontSize + 4}px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 8px 24px ${color4}40;
        margin-top: ${spacing * 2}px;
      }
      
      .cta-button:hover {
        background: ${color5};
        transform: translateY(-3px);
        box-shadow: 0 12px 32px ${color4}60;
      }
      
      .error-message {
        background: #fee2e2;
        color: ${color10};
        padding: 12px 16px;
        border-radius: ${radius}px;
        border-left: 4px solid ${color10};
        margin: ${spacing}px 0;
        font-size: ${fontSize - 2}px;
        font-weight: 600;
        display: none;
      }
      
      .error-message.visible {
        display: block;
        animation: shake 0.4s ease;
      }
      
      /* Bundle Builder Step */
      .bundle-step {
        max-width: 1000px;
        margin: 0 auto;
      }
      
      .bundle-header {
        text-align: center;
        margin-bottom: ${spacing * 3}px;
        animation: fadeInDown 0.6s ease;
      }
      
      .bundle-headline {
        font-size: ${fontSize * 2.5}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing}px;
        letter-spacing: -1px;
      }
      
      .bundle-subheadline {
        font-size: ${fontSize + 2}px;
        color: ${color7};
        margin-bottom: ${spacing * 2}px;
      }
      
      .bundle-card {
        background: ${color1};
        padding: ${spacing * 3}px;
        border-radius: ${radius * 2}px;
        box-shadow: 0 20px 60px ${color11};
        animation: fadeInUp 0.8s ease;
      }
      
      /* Savings Meter */
      .savings-meter-section {
        background: linear-gradient(135deg, ${color13}15 0%, ${color13}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
        border: 2px solid ${color13};
      }
      
      .savings-meter-title {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing}px;
        text-align: center;
      }
      
      .progress-bar-container {
        background: ${color3};
        height: 30px;
        border-radius: 15px;
        overflow: hidden;
        margin-bottom: ${spacing}px;
        position: relative;
      }
      
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, ${color9} 0%, ${color4} 50%, ${color13} 100%);
        border-radius: 15px;
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: ${fontSize - 2}px;
        color: ${color1};
      }
      
      .tier-indicators {
        display: flex;
        justify-content: space-between;
        margin-top: ${spacing / 2}px;
      }
      
      .tier-indicator {
        font-size: ${fontSize - 3}px;
        color: ${color7};
        font-weight: 600;
      }
      
      .tier-indicator.active {
        color: ${color4};
        font-weight: 800;
      }
      
      .savings-message {
        text-align: center;
        font-size: ${fontSize}px;
        color: ${color6};
        font-weight: 600;
        margin-top: ${spacing}px;
      }
      
      /* Main Product Display */
      .main-product-display {
        background: linear-gradient(135deg, ${color9}15 0%, ${color9}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
        border-left: 4px solid ${color9};
      }
      
      .main-product-label {
        font-size: ${fontSize - 2}px;
        color: ${color7};
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: ${spacing / 2}px;
      }
      
      .main-product-info {
        display: flex;
        align-items: center;
        gap: ${spacing}px;
      }
      
      .main-product-name {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color6};
        flex: 1;
      }
      
      .main-product-price {
        font-size: ${fontSize + 4}px;
        font-weight: 800;
        color: ${color8};
      }
      
      /* Bundle Products */
      .bundle-products-section {
        margin-bottom: ${spacing * 3}px;
      }
      
      .bundle-products-title {
        font-size: ${fontSize + 4}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing * 2}px;
        text-align: center;
      }
      
      .bundle-products-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: ${spacing * 2}px;
      }
      
      .bundle-product-card {
        background: ${color2};
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        border: 3px solid ${color3};
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
      }
      
      .bundle-product-card:hover {
        border-color: ${color4};
        transform: translateY(-2px);
        box-shadow: 0 8px 16px ${color11};
      }
      
      .bundle-product-card.selected {
        border-color: ${color4};
        background: ${color4}10;
        box-shadow: 0 0 0 3px ${color4}30;
      }
      
      .bundle-checkbox {
        position: absolute;
        top: ${spacing}px;
        right: ${spacing}px;
        width: 32px;
        height: 32px;
        border: 3px solid ${color3};
        border-radius: 8px;
        background: ${color1};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 800;
        color: ${color1};
        transition: all 0.3s;
      }
      
      .bundle-product-card.selected .bundle-checkbox {
        background: ${color9};
        border-color: ${color9};
      }
      
      .bundle-product-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: ${radius}px;
        margin-bottom: ${spacing}px;
      }
      
      .bundle-product-name {
        font-size: ${fontSize}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing / 2}px;
      }
      
      .bundle-product-price {
        font-size: ${fontSize + 2}px;
        font-weight: 800;
        color: ${color4};
      }
      
      /* Discount Tiers */
      .discount-tiers-section {
        background: linear-gradient(135deg, ${color12}15 0%, ${color12}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
      }
      
      .discount-tiers-title {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing}px;
        text-align: center;
      }
      
      .tier-list {
        display: grid;
        gap: ${spacing / 2}px;
      }
      
      .tier-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${spacing}px ${spacing * 2}px;
        background: ${color1};
        border-radius: ${radius}px;
        font-size: ${fontSize}px;
        font-weight: 600;
        color: ${color6};
        transition: all 0.3s;
      }
      
      .tier-item.active {
        background: ${color4};
        color: ${color1};
        transform: scale(1.05);
        box-shadow: 0 4px 12px ${color4}40;
      }
      
      .tier-label {
        flex: 1;
      }
      
      .tier-badge {
        background: ${color2};
        padding: 4px 12px;
        border-radius: 12px;
        font-size: ${fontSize - 3}px;
        font-weight: 700;
      }
      
      .tier-item.active .tier-badge {
        background: ${color1}40;
        color: ${color1};
      }
      
      /* Summary Section */
      .bundle-summary {
        background: linear-gradient(135deg, ${color4}15 0%, ${color4}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
      }
      
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: ${spacing}px 0;
        font-size: ${fontSize + 2}px;
        color: ${color6};
      }
      
      .summary-row.total {
        border-top: 3px solid ${color6};
        margin-top: ${spacing}px;
        padding-top: ${spacing * 2}px;
        font-size: ${fontSize + 4}px;
        font-weight: 800;
      }
      
      .summary-label {
        font-weight: 600;
      }
      
      .summary-value {
        font-weight: 800;
      }
      
      .summary-value.discount {
        color: ${color9};
      }
      
      .summary-value.savings {
        color: ${color10};
        font-size: ${fontSize + 6}px;
      }
      
      .social-proof {
        text-align: center;
        font-size: ${fontSize}px;
        color: ${color7};
        margin-bottom: ${spacing * 2}px;
      }
      
      .action-buttons {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: ${spacing}px;
      }
      
      .complete-bundle-button {
        padding: ${spacing + 4}px ${spacing * 3}px;
        background: ${color9};
        color: ${color1};
        border: none;
        border-radius: ${radius * 2}px;
        font-size: ${fontSize + 4}px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 8px 24px ${color9}40;
      }
      
      .complete-bundle-button:hover {
        background: #059669;
        transform: translateY(-3px);
        box-shadow: 0 12px 32px ${color9}60;
      }
      
      .skip-bundle-button {
        padding: ${spacing + 4}px ${spacing * 3}px;
        background: transparent;
        color: ${color7};
        border: 2px solid ${color3};
        border-radius: ${radius * 2}px;
        font-size: ${fontSize}px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .skip-bundle-button:hover {
        background: ${color2};
        border-color: ${color7};
        color: ${color6};
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      @media (max-width: 768px) {
        .product-content {
          grid-template-columns: 1fr;
        }
        
        .bundle-products-grid {
          grid-template-columns: 1fr;
        }
        
        .action-buttons {
          grid-template-columns: 1fr;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  optimizeImageUrl(url, width = 600, height = 600) {
    if (!url) return '';
    
    try {
      const mediaMatch = url.match(/\/media\/([^/]+)/);
      if (!mediaMatch) return url;
      
      const mediaId = mediaMatch[1];
      return `https://static.wixstatic.com/media/${mediaId}/v1/fill/w_${width},h_${height},al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/${mediaId}`;
    } catch (error) {
      return url;
    }
  }

  getAllImages() {
    if (!this.product) return [];
    
    const images = [];
    
    if (this.product.media?.mainMedia?.image?.url) {
      images.push(this.product.media.mainMedia.image.url);
    }
    
    if (this.product.media?.items) {
      this.product.media.items.forEach(item => {
        if (item.image?.url && item.image.url !== images[0]) {
          images.push(item.image.url);
        }
      });
    }
    
    return images.slice(0, 5);
  }

  getNumericPrice(priceStr) {
    if (!priceStr) return 0;
    const numStr = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(numStr) || 0;
  }

  calculateBundleStats() {
    const mainPrice = this.getNumericPrice(this.product?.priceData?.formatted?.price);
    let bundleTotal = mainPrice;
    
    this.selectedBundles.forEach(id => {
      const bundleProduct = this.bundleProducts.find(p => p._id === id);
      if (bundleProduct) {
        bundleTotal += this.getNumericPrice(bundleProduct.priceData?.formatted?.price);
      }
    });
    
    const itemCount = this.selectedBundles.size + 1;
    let discountPercent = 0;
    
    if (itemCount >= 5) {
      discountPercent = parseInt(this.styleProps.slider7);
    } else if (itemCount >= 4) {
      discountPercent = parseInt(this.styleProps.slider6);
    } else if (itemCount >= 3) {
      discountPercent = parseInt(this.styleProps.slider5);
    } else if (itemCount >= 2) {
      discountPercent = parseInt(this.styleProps.slider4);
    }
    
    const discountAmount = (bundleTotal * discountPercent) / 100;
    const finalPrice = bundleTotal - discountAmount;
    
    return {
      itemCount,
      bundleTotal,
      discountPercent,
      discountAmount,
      finalPrice
    };
  }

  render() {
    if (!this.product && this.currentStep === 'product') {
      this.innerHTML = `
        <style>${this.getStyles()}</style>
        <div class="funnel-container">
          <div style="padding: 100px 20px; text-align: center; color: ${this.styleProps.color7};">
            <h2 style="font-size: 32px; margin: 0 0 16px 0;">Select a Product</h2>
            <p style="font-size: 18px;">Configure your bundle builder to get started.</p>
          </div>
        </div>
      `;
      return;
    }

    if (this.currentStep === 'product') {
      this.renderProductStep();
    } else if (this.currentStep === 'bundle') {
      this.renderBundleStep();
    }
  }

  renderProductStep() {
    const images = this.getAllImages();

    const productTitle = this.styleProps.text1 || this.product.name;
    const productSubtitle = this.styleProps.text2 || this.product.description?.substring(0, 150) || 'Premium quality product';

    this.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="funnel-container">
        <div class="product-step">
          <div class="product-header">
            <h1 class="product-title">${productTitle}</h1>
            <p class="product-subtitle">${productSubtitle}</p>
          </div>
          
          <div class="product-content">
            <div class="product-gallery">
              <div class="main-image-container">
                ${images.map((img, index) => `
                  <img 
                    class="main-image ${index === 0 ? '' : 'hidden'}" 
                    src="${this.optimizeImageUrl(img, 600, 600)}"
                    alt="${this.product.name}"
                    data-image-index="${index}"
                  >
                `).join('')}
              </div>
              
              ${images.length > 1 ? `
                <div class="thumbnail-gallery">
                  ${images.map((img, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" data-thumbnail="${index}">
                      <img src="${this.optimizeImageUrl(img, 100, 100)}" alt="View ${index + 1}">
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            
            <div class="product-details">
              <h2 class="product-name">${this.product.name}</h2>
              
              <div class="product-price">
                ${this.product.priceData?.formatted?.price || 'Contact for price'}
              </div>
              
              ${this.product.description ? `
                <div class="product-description">${this.product.description.substring(0, 200)}...</div>
              ` : ''}
              
              ${this.product.productOptions && this.product.productOptions.length > 0 ? `
                ${this.product.productOptions.map(option => `
                  <div class="option-group">
                    <label class="option-label">${option.name}</label>
                    
                    ${option.optionType === 'color' ? `
                      <div class="color-swatches">
                        ${option.choices.map(choice => `
                          <div 
                            class="color-swatch" 
                            style="background-color: ${choice.value};"
                            data-option="${option.name}"
                            data-value="${choice.description}"
                          ></div>
                        `).join('')}
                      </div>
                    ` : option.choices.length <= 6 ? `
                      <div class="size-buttons">
                        ${option.choices.map(choice => `
                          <button 
                            class="size-button"
                            data-option="${option.name}"
                            data-value="${choice.description}"
                          >${choice.description}</button>
                        `).join('')}
                      </div>
                    ` : `
                      <select class="dropdown-select" data-option="${option.name}">
                        <option value="">Choose ${option.name}</option>
                        ${option.choices.map(choice => `
                          <option value="${choice.description}">${choice.description}</option>
                        `).join('')}
                      </select>
                    `}
                  </div>
                `).join('')}
              ` : ''}
              
              <div class="quantity-selector">
                <span class="quantity-label">Quantity</span>
                <div class="quantity-controls">
                  <button class="quantity-btn" data-action="decrease">−</button>
                  <span class="quantity-value">1</span>
                  <button class="quantity-btn" data-action="increase">+</button>
                </div>
              </div>
              
              <div class="features-grid">
                <div class="feature-item">
                  <div class="feature-title">${this.styleProps.text4}</div>
                  <div class="feature-text">${this.styleProps.text5}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-title">${this.styleProps.text6}</div>
                  <div class="feature-text">${this.styleProps.text7}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-title">${this.styleProps.text8}</div>
                  <div class="feature-text">${this.styleProps.text9}</div>
                </div>
              </div>
              
              <div class="error-message"></div>
              
              <button class="cta-button">${this.styleProps.text3}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachProductListeners();
  }

  renderBundleStep() {
    const stats = this.calculateBundleStats();
    const progressPercent = Math.min((stats.itemCount / 5) * 100, 100);
    
    const tier2Discount = parseInt(this.styleProps.slider4);
    const tier3Discount = parseInt(this.styleProps.slider5);
    const tier4Discount = parseInt(this.styleProps.slider6);
    const tier5Discount = parseInt(this.styleProps.slider7);

    this.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="funnel-container">
        <div class="bundle-step">
          <div class="bundle-header">
            <h1 class="bundle-headline">${this.styleProps.text10}</h1>
            <p class="bundle-subheadline">${this.styleProps.text11}</p>
          </div>
          
          <div class="bundle-card">
            <div class="savings-meter-section">
              <div class="savings-meter-title">${this.styleProps.text18}</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%">
                  ${stats.discountPercent > 0 ? `${stats.discountPercent}% OFF` : ''}
                </div>
              </div>
              <div class="tier-indicators">
                <div class="tier-indicator ${stats.itemCount >= 2 ? 'active' : ''}">2</div>
                <div class="tier-indicator ${stats.itemCount >= 3 ? 'active' : ''}">3</div>
                <div class="tier-indicator ${stats.itemCount >= 4 ? 'active' : ''}">4</div>
                <div class="tier-indicator ${stats.itemCount >= 5 ? 'active' : ''}">5+</div>
              </div>
              <div class="savings-message">
                ${stats.itemCount < 5 ? this.styleProps.text19 : '🔥 Maximum discount unlocked!'}
              </div>
            </div>
            
            <div class="main-product-display">
              <div class="main-product-label">✅ Main Product (Included)</div>
              <div class="main-product-info">
                <div class="main-product-name">${this.product.name}</div>
                <div class="main-product-price">${this.product.priceData?.formatted?.price}</div>
              </div>
            </div>
            
            <div class="bundle-products-section">
              <div class="bundle-products-title">${this.styleProps.text14}</div>
              <div class="bundle-products-grid">
                ${this.bundleProducts.map(bundleProduct => {
                  const isSelected = this.selectedBundles.has(bundleProduct._id);
                  const imageUrl = bundleProduct.media?.mainMedia?.image?.url || '';
                  
                  return `
                    <div class="bundle-product-card ${isSelected ? 'selected' : ''}" data-bundle-id="${bundleProduct._id}">
                      <div class="bundle-checkbox">${isSelected ? '✓' : ''}</div>
                      ${imageUrl ? `<img class="bundle-product-image" src="${this.optimizeImageUrl(imageUrl, 200, 200)}" alt="${bundleProduct.name}">` : ''}
                      <div class="bundle-product-name">${bundleProduct.name}</div>
                      <div class="bundle-product-price">+${bundleProduct.priceData?.formatted?.price}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <div class="discount-tiers-section">
              <div class="discount-tiers-title">${this.styleProps.text17}</div>
              <div class="tier-list">
                <div class="tier-item ${stats.itemCount >= 2 && stats.itemCount < 3 ? 'active' : ''}">
                  <span class="tier-label">2 items</span>
                  <span class="tier-badge">${tier2Discount}% OFF</span>
                </div>
                <div class="tier-item ${stats.itemCount >= 3 && stats.itemCount < 4 ? 'active' : ''}">
                  <span class="tier-label">3 items</span>
                  <span class="tier-badge">${tier3Discount}% OFF ⭐</span>
                </div>
                <div class="tier-item ${stats.itemCount >= 4 && stats.itemCount < 5 ? 'active' : ''}">
                  <span class="tier-label">4 items</span>
                  <span class="tier-badge">${tier4Discount}% OFF</span>
                </div>
                <div class="tier-item ${stats.itemCount >= 5 ? 'active' : ''}">
                  <span class="tier-label">5+ items</span>
                  <span class="tier-badge">${tier5Discount}% OFF 🔥</span>
                </div>
              </div>
            </div>
            
            <div class="bundle-summary">
              <div class="summary-row">
                <span class="summary-label">${this.styleProps.text21}:</span>
                <span class="summary-value">$${stats.bundleTotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">${this.styleProps.text22}:</span>
                <span class="summary-value discount">-$${stats.discountAmount.toFixed(2)} (${stats.discountPercent}%)</span>
              </div>
              <div class="summary-row total">
                <span class="summary-label">${this.styleProps.text23}:</span>
                <span class="summary-value savings">$${stats.finalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="social-proof">${this.styleProps.text15}</div>
            
            <div class="action-buttons">
              <button class="complete-bundle-button">${this.styleProps.text12}</button>
              <button class="skip-bundle-button">${this.styleProps.text13}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachBundleListeners();
  }

  attachProductListeners() {
    this.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.thumbnail);
        this.switchImage(index);
      });
    });

    this.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const option = e.target.dataset.option;
        const value = e.target.dataset.value;
        
        this.selectedOptions[option] = value;
        
        this.querySelectorAll(`.color-swatch[data-option="${option}"]`).forEach(s => {
          s.classList.remove('selected');
        });
        e.target.classList.add('selected');
        
        this.clearError();
      });
    });

    this.querySelectorAll('.size-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const option = e.target.dataset.option;
        const value = e.target.dataset.value;
        
        this.selectedOptions[option] = value;
        
        this.querySelectorAll(`.size-button[data-option="${option}"]`).forEach(b => {
          b.classList.remove('selected');
        });
        e.target.classList.add('selected');
        
        this.clearError();
      });
    });

    this.querySelectorAll('.dropdown-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const option = e.target.dataset.option;
        const value = e.target.value;
        
        if (value) {
          this.selectedOptions[option] = value;
        } else {
          delete this.selectedOptions[option];
        }
        
        this.clearError();
      });
    });

    this.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const valueEl = this.querySelector('.quantity-value');
        
        if (action === 'decrease' && this.quantity > 1) {
          this.quantity--;
        } else if (action === 'increase' && this.quantity < 99) {
          this.quantity++;
        }
        
        valueEl.textContent = this.quantity;
        
        const decreaseBtn = this.querySelector('[data-action="decrease"]');
        const increaseBtn = this.querySelector('[data-action="increase"]');
        decreaseBtn.disabled = this.quantity <= 1;
        increaseBtn.disabled = this.quantity >= 99;
      });
    });

    const ctaButton = this.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        if (this.validateOptions()) {
          this.dispatchEvent(new CustomEvent('continueToBundle', {
            detail: {
              productId: this.product._id,
              choices: this.selectedOptions,
              quantity: this.quantity
            }
          }));
        }
      });
    }
  }

  attachBundleListeners() {
    this.querySelectorAll('.bundle-product-card').forEach(card => {
      card.addEventListener('click', () => {
        const bundleId = card.dataset.bundleId;
        
        if (this.selectedBundles.has(bundleId)) {
          this.selectedBundles.delete(bundleId);
        } else {
          this.selectedBundles.add(bundleId);
        }
        
        this.renderBundleStep();
      });
    });

    const completeButton = this.querySelector('.complete-bundle-button');
    if (completeButton) {
      completeButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('completeBundle', {
          detail: {
            selectedBundles: Array.from(this.selectedBundles),
            bundleStats: this.calculateBundleStats()
          }
        }));
      });
    }

    const skipButton = this.querySelector('.skip-bundle-button');
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('skipBundle', {
          detail: {
            productId: this.product._id
          }
        }));
      });
    }
  }

  switchImage(index) {
    const images = this.querySelectorAll('.main-image');
    const thumbnails = this.querySelectorAll('.thumbnail');
    
    images.forEach(img => img.classList.add('hidden'));
    if (images[index]) {
      images[index].classList.remove('hidden');
    }
    
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[index]?.classList.add('active');
    
    this.currentImageIndex = index;
  }

  validateOptions() {
    if (!this.product.productOptions || this.product.productOptions.length === 0) {
      return true;
    }

    const missing = [];
    this.product.productOptions.forEach(option => {
      if (!this.selectedOptions[option.name]) {
        missing.push(option.name);
      }
    });

    if (missing.length > 0) {
      this.showError(`Please select: ${missing.join(', ')}`);
      return false;
    }

    return true;
  }

  showError(message) {
    const errorEl = this.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  clearError() {
    const errorEl = this.querySelector('.error-message');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  showBundleBuilder() {
    if (this.bundleProducts.length > 0) {
      this.currentStep = 'bundle';
      this.selectedBundles.clear();
      this.render();
    } else {
      this.dispatchEvent(new CustomEvent('skipBundle', {
        detail: { productId: this.product._id }
      }));
    }
  }
}

customElements.define('bundle-builder-element', BundleBuilderElement);
