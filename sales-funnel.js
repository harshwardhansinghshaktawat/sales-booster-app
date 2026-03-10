class SalesFunnelElement extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.upsellProducts = [];
    this.selectedOptions = {};
    this.quantity = 1;
    this.currentImageIndex = 0;
    this.currentStep = 'product'; // 'product', 'upsell1', 'upsell2', 'upsell3'
    this.acceptedUpsells = [];
    
    // Default style props
    this.styleProps = {
      // Colors
      color1: '#ffffff',        // Primary background
      color2: '#f8f9fa',        // Secondary background
      color3: '#e5e7eb',        // Border color
      color4: '#3b82f6',        // Primary accent
      color5: '#2563eb',        // Hover accent
      color6: '#1f2937',        // Text primary
      color7: '#6b7280',        // Text secondary
      color8: '#111827',        // Price color
      color9: '#10b981',        // Success/Accept color
      color10: '#ef4444',       // Decline color
      color11: 'rgba(0,0,0,0.1)', // Shadow color
      color12: '#fbbf24',       // Star/highlight color
      
      // Sliders
      slider1: '12',            // Card radius
      slider2: '16',            // Spacing
      slider3: '16',            // Font size
      
      // Text fields - Product Page
      text1: 'Premium Product',                          // Product page title override
      text2: 'Experience Excellence',                    // Product page subtitle
      text3: 'Add to Cart',                              // CTA button text
      text4: 'Premium Quality',                          // Feature 1 title
      text5: 'Crafted with care',                        // Feature 1 text
      text6: 'Fast Shipping',                            // Feature 2 title
      text7: 'Quick delivery',                           // Feature 2 text
      text8: '30-Day Returns',                           // Feature 3 title
      text9: 'Risk-free guarantee',                      // Feature 3 text
      
      // Text fields - Upsell Step
      text10: '🎉 Wait! Special Offer Just For You',    // Upsell headline
      text11: 'Complete your order with this amazing deal', // Upsell subheadline
      text12: 'Yes! Add This To My Order',               // Accept button
      text13: 'No Thanks, I\'ll Skip This Offer',       // Decline button
      text14: 'Why You\'ll Love This',                  // Benefits title
      text15: 'Perfect complement to your purchase',    // Benefit 1
      text16: 'Special discount - Today only',          // Benefit 2
      text17: 'Premium quality guaranteed',             // Benefit 3
      text18: '⚡ Limited Time Offer',                   // Urgency badge
      text19: 'Only available during checkout',         // Urgency text
      text20: 'One-Time Offer',                         // Offer badge
      
      // Dropdown options
      dropdown1: 'modern'       // Color preset
    };
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['product-data', 'upsell-data', 'style-props', 'funnel-action'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log(`🔔 Attribute changed: ${name}`, { oldVal, newVal });
    
    if (name === 'product-data' && newVal && newVal !== oldVal) {
      try {
        this.product = JSON.parse(newVal);
        console.log('📦 Main product loaded:', this.product?.name);
        this.selectedOptions = {};
        this.quantity = 1;
        this.currentStep = 'product';
        this.render();
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    }
    
    if (name === 'upsell-data' && newVal && newVal !== oldVal) {
      try {
        this.upsellProducts = JSON.parse(newVal);
        console.log('🎁 Upsell products loaded:', this.upsellProducts.length);
        console.log('   Products:', this.upsellProducts.map(p => p.name));
      } catch (error) {
        console.error('Error parsing upsell data:', error);
        this.upsellProducts = [];
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
      console.log('🎬🎬🎬 FUNNEL ACTION ATTRIBUTE CHANGED 🎬🎬🎬');
      console.log('   Old value:', oldVal);
      console.log('   New value:', newVal);
      
      // Only process if oldVal is different (first time set, not the removal)
      if (oldVal !== newVal) {
        console.log('🎬 Funnel action received:', newVal);
        console.log('   Current step before action:', this.currentStep);
        console.log('   Upsell products available:', this.upsellProducts?.length || 0);
        
        if (newVal === 'start-upsells') {
          console.log('   → Calling startUpsells()');
          this.startUpsells();
        } else if (newVal === 'next-step') {
          console.log('   → Calling nextStep()');
          this.nextStep();
        }
        
        // Clear the attribute to allow re-triggering
        console.log('   → Removing funnel-action attribute');
        this.removeAttribute('funnel-action');
      } else {
        console.log('⏭️ Skipping - oldVal === newVal');
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
      color9, color10, color11, color12,
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
      
      /* ========== PRODUCT PAGE STEP ========== */
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
      
      .ribbon {
        position: absolute;
        top: ${spacing}px;
        right: ${spacing}px;
        background: ${color10};
        color: ${color1};
        padding: 8px 16px;
        border-radius: 25px;
        font-size: ${fontSize - 2}px;
        font-weight: 700;
        text-transform: uppercase;
        z-index: 2;
        box-shadow: 0 4px 12px ${color11};
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
        display: flex;
        align-items: center;
        gap: ${spacing}px;
      }
      
      .original-price {
        font-size: ${fontSize + 4}px;
        color: ${color7};
        text-decoration: line-through;
        opacity: 0.7;
      }
      
      .discount-badge {
        background: ${color9};
        color: ${color1};
        padding: 6px 12px;
        border-radius: 20px;
        font-size: ${fontSize - 2}px;
        font-weight: 700;
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
      
      .feature-icon {
        font-size: ${fontSize * 2}px;
        margin-bottom: ${spacing / 2}px;
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
      
      .cta-button:active {
        transform: translateY(-1px);
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
      
      /* ========== UPSELL STEPS ========== */
      .upsell-step {
        max-width: 900px;
        margin: 0 auto;
      }
      
      .upsell-header {
        text-align: center;
        margin-bottom: ${spacing * 3}px;
        animation: fadeInDown 0.6s ease;
      }
      
      .upsell-headline {
        font-size: ${fontSize * 2.5}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing}px;
        letter-spacing: -1px;
      }
      
      .upsell-subheadline {
        font-size: ${fontSize + 4}px;
        color: ${color7};
        margin-bottom: ${spacing}px;
      }
      
      .urgency-badge {
        display: inline-block;
        background: ${color10};
        color: ${color1};
        padding: 8px 20px;
        border-radius: 25px;
        font-size: ${fontSize - 1}px;
        font-weight: 700;
        margin-bottom: ${spacing}px;
        animation: pulse 2s infinite;
      }
      
      .upsell-card {
        background: ${color1};
        padding: ${spacing * 3}px;
        border-radius: ${radius * 2}px;
        box-shadow: 0 20px 60px ${color11};
        animation: fadeInUp 0.8s ease;
        position: relative;
        overflow: hidden;
      }
      
      .offer-badge {
        position: absolute;
        top: 20px;
        right: -35px;
        background: ${color4};
        color: ${color1};
        padding: 8px 50px;
        font-size: ${fontSize - 2}px;
        font-weight: 700;
        transform: rotate(45deg);
        box-shadow: 0 4px 12px ${color11};
      }
      
      .upsell-product-info {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: ${spacing * 2}px;
        margin-bottom: ${spacing * 3}px;
      }
      
      .upsell-image {
        width: 200px;
        height: 200px;
        border-radius: ${radius}px;
        object-fit: cover;
        box-shadow: 0 8px 16px ${color11};
      }
      
      .upsell-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .upsell-name {
        font-size: ${fontSize * 1.5}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing / 2}px;
      }
      
      .upsell-description {
        font-size: ${fontSize}px;
        color: ${color7};
        line-height: 1.6;
        margin-bottom: ${spacing}px;
      }
      
      .upsell-price {
        font-size: ${fontSize * 2}px;
        font-weight: 800;
        color: ${color8};
        display: flex;
        align-items: center;
        gap: ${spacing}px;
      }
      
      .upsell-original-price {
        font-size: ${fontSize + 2}px;
        color: ${color7};
        text-decoration: line-through;
        opacity: 0.7;
      }
      
      .upsell-discount {
        background: ${color9};
        color: ${color1};
        padding: 4px 10px;
        border-radius: 15px;
        font-size: ${fontSize - 3}px;
        font-weight: 700;
      }
      
      .benefits-section {
        background: linear-gradient(135deg, ${color4}10 0%, ${color4}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
      }
      
      .benefits-title {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing}px;
        text-align: center;
      }
      
      .benefits-list {
        display: grid;
        gap: ${spacing}px;
      }
      
      .benefit-item {
        display: flex;
        align-items: center;
        gap: ${spacing}px;
        padding: ${spacing}px;
        background: ${color1};
        border-radius: ${radius}px;
        box-shadow: 0 2px 8px ${color11};
      }
      
      .benefit-icon {
        width: 40px;
        height: 40px;
        background: ${color9};
        color: ${color1};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${fontSize + 4}px;
        flex-shrink: 0;
      }
      
      .benefit-text {
        font-size: ${fontSize}px;
        color: ${color6};
        font-weight: 600;
      }
      
      .urgency-section {
        text-align: center;
        padding: ${spacing * 2}px;
        background: linear-gradient(135deg, ${color10}15 0%, ${color10}05 100%);
        border-radius: ${radius}px;
        margin-bottom: ${spacing * 3}px;
        border: 2px dashed ${color10};
      }
      
      .urgency-text {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color10};
      }
      
      .action-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${spacing}px;
      }
      
      .accept-button {
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
      
      .accept-button:hover {
        background: #059669;
        transform: translateY(-3px);
        box-shadow: 0 12px 32px ${color9}60;
      }
      
      .decline-button {
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
      
      .decline-button:hover {
        background: ${color2};
        border-color: ${color7};
        color: ${color6};
      }
      
      /* ========== ANIMATIONS ========== */
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
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      /* ========== RESPONSIVE ========== */
      @media (max-width: 768px) {
        .product-content {
          grid-template-columns: 1fr;
        }
        
        .upsell-product-info {
          grid-template-columns: 1fr;
          text-align: center;
        }
        
        .upsell-image {
          width: 100%;
          height: 300px;
          margin: 0 auto;
        }
        
        .action-buttons {
          grid-template-columns: 1fr;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
        
        .product-title {
          font-size: ${fontSize * 2}px;
        }
        
        .upsell-headline {
          font-size: ${fontSize * 1.8}px;
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

  calculateDiscount(originalPrice, discountedPrice) {
    const getNumericPrice = (priceStr) => {
      if (!priceStr) return 0;
      const numStr = priceStr.replace(/[^0-9.]/g, '');
      return parseFloat(numStr) || 0;
    };

    const original = getNumericPrice(originalPrice);
    const discounted = getNumericPrice(discountedPrice);

    if (original > 0 && discounted > 0 && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  }

  render() {
    if (!this.product && this.currentStep === 'product') {
      this.innerHTML = `
        <style>${this.getStyles()}</style>
        <div class="funnel-container">
          <div style="padding: 100px 20px; text-align: center; color: ${this.styleProps.color7};">
            <h2 style="font-size: 32px; margin: 0 0 16px 0;">Select a Product</h2>
            <p style="font-size: 18px;">Configure your sales funnel to get started.</p>
          </div>
        </div>
      `;
      return;
    }

    if (this.currentStep === 'product') {
      this.renderProductStep();
    } else if (this.currentStep.startsWith('upsell')) {
      this.renderUpsellStep();
    }
  }

  renderProductStep() {
    const images = this.getAllImages();
    const hasDiscount = this.product.priceData?.formatted?.discountedPrice && 
                        this.product.priceData?.formatted?.discountedPrice !== this.product.priceData?.formatted?.price;
    const discountPercent = hasDiscount ? 
      this.calculateDiscount(this.product.priceData?.formatted?.price, this.product.priceData?.formatted?.discountedPrice) : 0;

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
              ${this.product.ribbon ? `<div class="ribbon">${this.product.ribbon}</div>` : ''}
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
                ${hasDiscount ? `
                  <span>${this.product.priceData.formatted.discountedPrice}</span>
                  <span class="original-price">${this.product.priceData.formatted.price}</span>
                  ${discountPercent > 0 ? `<span class="discount-badge">Save ${discountPercent}%</span>` : ''}
                ` : `
                  <span>${this.product.priceData?.formatted?.price || 'Contact for price'}</span>
                `}
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
                  <div class="feature-icon">✓</div>
                  <div class="feature-title">${this.styleProps.text4}</div>
                  <div class="feature-text">${this.styleProps.text5}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-title">${this.styleProps.text6}</div>
                  <div class="feature-text">${this.styleProps.text7}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">↺</div>
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

  renderUpsellStep() {
    console.log('🎁 Rendering upsell step');
    console.log('   Current step:', this.currentStep);
    console.log('   Upsell products array:', this.upsellProducts);
    
    const stepNumber = parseInt(this.currentStep.replace('upsell', '')) - 1;
    console.log('   Accessing index:', stepNumber);
    
    const upsellProduct = this.upsellProducts[stepNumber];
    
    if (!upsellProduct) {
      console.log('❌ No product at index', stepNumber, '- completing upsells');
      this.completeUpsells();
      return;
    }
    
    console.log('✅ Rendering upsell product:', upsellProduct.name);

    const hasDiscount = upsellProduct.priceData?.formatted?.discountedPrice && 
                        upsellProduct.priceData?.formatted?.discountedPrice !== upsellProduct.priceData?.formatted?.price;
    const discountPercent = hasDiscount ? 
      this.calculateDiscount(upsellProduct.priceData?.formatted?.price, upsellProduct.priceData?.formatted?.discountedPrice) : 0;

    const imageUrl = upsellProduct.media?.mainMedia?.image?.url || '';

    this.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="funnel-container">
        <div class="upsell-step">
          <div class="upsell-header">
            <div class="urgency-badge">${this.styleProps.text18}</div>
            <h1 class="upsell-headline">${this.styleProps.text10}</h1>
            <p class="upsell-subheadline">${this.styleProps.text11}</p>
          </div>
          
          <div class="upsell-card">
            <div class="offer-badge">${this.styleProps.text20}</div>
            
            <div class="upsell-product-info">
              <img 
                class="upsell-image" 
                src="${this.optimizeImageUrl(imageUrl, 300, 300)}" 
                alt="${upsellProduct.name}"
              >
              
              <div class="upsell-details">
                <h2 class="upsell-name">${upsellProduct.name}</h2>
                <p class="upsell-description">${upsellProduct.description?.substring(0, 150) || 'Enhance your purchase with this amazing product.'}</p>
                
                <div class="upsell-price">
                  ${hasDiscount ? `
                    <span>${upsellProduct.priceData.formatted.discountedPrice}</span>
                    <span class="upsell-original-price">${upsellProduct.priceData.formatted.price}</span>
                    ${discountPercent > 0 ? `<span class="upsell-discount">Save ${discountPercent}%</span>` : ''}
                  ` : `
                    <span>${upsellProduct.priceData?.formatted?.price || 'Special offer'}</span>
                  `}
                </div>
              </div>
            </div>
            
            <div class="benefits-section">
              <h3 class="benefits-title">${this.styleProps.text14}</h3>
              <div class="benefits-list">
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">${this.styleProps.text15}</div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">${this.styleProps.text16}</div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">${this.styleProps.text17}</div>
                </div>
              </div>
            </div>
            
            <div class="urgency-section">
              <p class="urgency-text">${this.styleProps.text19}</p>
            </div>
            
            <div class="action-buttons">
              <button class="accept-button" data-upsell-action="accept">${this.styleProps.text12}</button>
              <button class="decline-button" data-upsell-action="decline">${this.styleProps.text13}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachUpsellListeners();
  }

  attachProductListeners() {
    // Thumbnails
    this.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.thumbnail);
        this.switchImage(index);
      });
    });

    // Color swatches
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

    // Size buttons
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

    // Dropdowns
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

    // Quantity
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

    // CTA Button
    const ctaButton = this.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        if (this.validateOptions()) {
          this.dispatchEvent(new CustomEvent('addToCart', {
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

  attachUpsellListeners() {
    const acceptBtn = this.querySelector('[data-upsell-action="accept"]');
    const declineBtn = this.querySelector('[data-upsell-action="decline"]');

    console.log('🔗 Attaching upsell listeners');
    console.log('   Accept button found:', !!acceptBtn);
    console.log('   Decline button found:', !!declineBtn);

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        console.log('🎯 Accept button clicked!');
        console.log('   Current step:', this.currentStep);
        
        const stepNumber = parseInt(this.currentStep.replace('upsell', '')) - 1;
        const upsellProduct = this.upsellProducts[stepNumber];
        
        console.log('   Step number:', stepNumber);
        console.log('   Upsell product:', upsellProduct?.name);
        console.log('   Product ID:', upsellProduct?._id);
        
        this.acceptedUpsells.push(upsellProduct._id);
        
        console.log('   Dispatching acceptUpsell event...');
        this.dispatchEvent(new CustomEvent('acceptUpsell', {
          detail: {
            productId: upsellProduct._id,
            quantity: 1
          }
        }));
        console.log('   ✅ Event dispatched');
      });
    } else {
      console.error('❌ Accept button not found!');
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        console.log('🚫 Decline button clicked!');
        this.nextStep();
      });
    } else {
      console.error('❌ Decline button not found!');
    }
  }

  nextStep() {
    console.log('🔄 NextStep called');
    console.log('   Current step:', this.currentStep);
    console.log('   Total upsell products:', this.upsellProducts.length);
    
    const currentUpsellNum = parseInt(this.currentStep.replace('upsell', '') || '0');
    const nextUpsellNum = currentUpsellNum + 1;
    
    console.log('   Current upsell num:', currentUpsellNum);
    console.log('   Next upsell num:', nextUpsellNum);
    
    // Check if there's another upsell to show
    // nextUpsellNum is 1-based (upsell1, upsell2, upsell3)
    // array length tells us how many products we have
    if (nextUpsellNum <= this.upsellProducts.length) {
      console.log('   ✅ Moving to upsell', nextUpsellNum);
      this.currentStep = `upsell${nextUpsellNum}`;
      this.render();
    } else {
      console.log('   ✅ No more upsells, completing funnel');
      this.completeUpsells();
    }
  }

  completeUpsells() {
    console.log('✅ Funnel complete! Redirecting to cart...');
    this.dispatchEvent(new CustomEvent('funnelComplete', {
      detail: {
        acceptedUpsells: this.acceptedUpsells
      }
    }));
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

  startUpsells() {
    console.log('🚀 Starting upsell sequence');
    console.log('   Upsell products available:', this.upsellProducts.length);
    
    if (this.upsellProducts.length > 0) {
      console.log('   ✅ Starting with upsell1');
      this.currentStep = 'upsell1';
      this.render();
    } else {
      console.log('   ⚠️ No upsell products, completing funnel');
      this.completeUpsells();
    }
  }
}

customElements.define('sales-funnel-element', SalesFunnelElement);
