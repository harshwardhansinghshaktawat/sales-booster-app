class DailyDealTickerElement extends HTMLElement {
  constructor() {
    super();
    this.products = [];
    this.currentDealIndex = 0;
    this.startDate = null;
    this.timezone = 'America/New_York';
    this.timerInterval = null;
    this.transitionInterval = null;
    
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
      slider1: '16',
      slider2: '20',
      slider3: '16',
      text1: 'Daily Deal',
      text2: 'Limited Time Offer',
      text3: 'Shop Now',
      text4: 'Deal Ends In:',
      text5: 'Next Deal Starts In:',
      text6: 'Hours',
      text7: 'Minutes',
      text8: 'Seconds',
      text9: 'Days',
      text10: 'FLASH SALE',
      dropdown1: 'modernBlue'
    };
  }

  connectedCallback() {
    this.render();
    this.startTimer();
    this.startAutoTransition();
  }

  disconnectedCallback() {
    this.stopTimer();
    this.stopAutoTransition();
  }

  static get observedAttributes() {
    return ['products-data', 'start-date', 'timezone', 'style-props'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'products-data' && newVal && newVal !== oldVal) {
      try {
        this.products = JSON.parse(newVal);
        if (this.products.length > 0) {
          this.calculateCurrentDeal();
          this.render();
        }
      } catch (error) {
        console.error('Error parsing products data:', error);
      }
    }
    
    if (name === 'start-date' && newVal && newVal !== oldVal) {
      this.startDate = newVal;
      this.calculateCurrentDeal();
      this.render();
    }
    
    if (name === 'timezone' && newVal && newVal !== oldVal) {
      this.timezone = newVal;
      this.calculateCurrentDeal();
      this.render();
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
  }

  updateStyles() {
    const styleElement = this.querySelector('style');
    if (styleElement) {
      styleElement.textContent = this.getStyles();
    }
  }

  calculateCurrentDeal() {
    if (!this.startDate || this.products.length === 0) {
      this.currentDealIndex = 0;
      return;
    }

    try {
      const now = new Date();
      const start = new Date(this.startDate);
      
      const diffMs = now - start;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      this.currentDealIndex = diffDays % this.products.length;
      
      if (this.currentDealIndex < 0) {
        this.currentDealIndex = 0;
      }
    } catch (error) {
      console.error('Error calculating current deal:', error);
      this.currentDealIndex = 0;
    }
  }

  getTimeUntilNextDeal() {
    if (!this.startDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    try {
      const now = new Date();
      const start = new Date(this.startDate);
      
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      
      const diffMs = midnight - now;
      
      if (diffMs < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    } catch (error) {
      console.error('Error calculating time:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  startAutoTransition() {
    this.stopAutoTransition();
    // Don't auto-transition, let the daily rotation handle it
  }

  stopAutoTransition() {
    if (this.transitionInterval) {
      clearInterval(this.transitionInterval);
      this.transitionInterval = null;
    }
  }

  updateTimer() {
    const time = this.getTimeUntilNextDeal();
    
    const hoursEl = this.querySelector('.timer-hours');
    const minutesEl = this.querySelector('.timer-minutes');
    const secondsEl = this.querySelector('.timer-seconds');
    
    if (hoursEl) hoursEl.textContent = String(time.hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(time.minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(time.seconds).padStart(2, '0');
    
    // Check if we need to move to next deal (midnight passed)
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      this.calculateCurrentDeal();
      this.render();
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
      
      .ticker-container {
        width: 100%;
        background: linear-gradient(135deg, ${color2} 0%, ${color1} 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
      }
      
      .ticker-wrapper {
        max-width: 1400px;
        margin: 0 auto;
        padding: ${spacing * 2}px;
      }
      
      .deal-card {
        background: ${color1};
        border-radius: ${radius * 2}px;
        box-shadow: 0 20px 60px ${color11};
        overflow: hidden;
        animation: slideIn 0.8s ease;
      }
      
      .deal-header {
        background: linear-gradient(135deg, ${color4} 0%, ${color5} 100%);
        padding: ${spacing}px ${spacing * 2}px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .deal-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 30%,
          rgba(255,255,255,0.1) 50%,
          transparent 70%
        );
        animation: shimmer 3s infinite;
      }
      
      .flash-badge {
        display: inline-block;
        background: ${color12};
        color: ${color8};
        padding: ${spacing / 2}px ${spacing * 2}px;
        border-radius: ${radius * 3}px;
        font-size: ${fontSize - 2}px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        animation: pulse 2s infinite;
        position: relative;
        z-index: 1;
      }
      
      .deal-title {
        font-size: ${fontSize + 8}px;
        font-weight: 800;
        color: ${color1};
        margin: ${spacing / 2}px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
        z-index: 1;
      }
      
      .deal-subtitle {
        font-size: ${fontSize}px;
        color: ${color1};
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }
      
      .deal-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${spacing * 3}px;
        padding: ${spacing * 3}px;
      }
      
      .product-section {
        display: flex;
        flex-direction: column;
        gap: ${spacing * 2}px;
      }
      
      .product-image-container {
        position: relative;
        width: 100%;
        padding-top: 100%;
        background: ${color2};
        border-radius: ${radius}px;
        overflow: hidden;
        border: 3px solid ${color3};
        transition: all 0.3s;
      }
      
      .product-image-container:hover {
        border-color: ${color4};
        transform: scale(1.02);
        box-shadow: 0 10px 30px ${color11};
      }
      
      .product-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .discount-badge {
        position: absolute;
        top: ${spacing}px;
        right: ${spacing}px;
        background: ${color10};
        color: ${color1};
        padding: ${spacing}px ${spacing * 2}px;
        border-radius: ${radius * 2}px;
        font-size: ${fontSize + 2}px;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2;
        animation: bounce 2s infinite;
      }
      
      .product-details {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .product-name {
        font-size: ${fontSize * 1.5}px;
        font-weight: 800;
        color: ${color6};
        margin-bottom: ${spacing}px;
        line-height: 1.3;
      }
      
      .product-description {
        font-size: ${fontSize}px;
        color: ${color7};
        line-height: 1.6;
        margin-bottom: ${spacing * 2}px;
        flex: 1;
      }
      
      .price-section {
        background: linear-gradient(135deg, ${color9}10 0%, ${color9}05 100%);
        padding: ${spacing * 2}px;
        border-radius: ${radius}px;
        border-left: 4px solid ${color9};
        margin-bottom: ${spacing * 2}px;
      }
      
      .price-label {
        font-size: ${fontSize - 2}px;
        color: ${color7};
        margin-bottom: ${spacing / 2}px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .price-display {
        display: flex;
        align-items: baseline;
        gap: ${spacing}px;
      }
      
      .current-price {
        font-size: ${fontSize * 2.5}px;
        font-weight: 800;
        color: ${color9};
      }
      
      .original-price {
        font-size: ${fontSize * 1.2}px;
        color: ${color7};
        text-decoration: line-through;
      }
      
      .savings-amount {
        font-size: ${fontSize}px;
        color: ${color10};
        font-weight: 700;
      }
      
      .cta-button {
        width: 100%;
        padding: ${spacing + 4}px ${spacing * 3}px;
        background: linear-gradient(135deg, ${color4} 0%, ${color5} 100%);
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
      }
      
      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px ${color4}60;
      }
      
      .timer-section {
        background: linear-gradient(135deg, ${color13}15 0%, ${color13}05 100%);
        padding: ${spacing * 3}px;
        border-radius: ${radius}px;
        text-align: center;
      }
      
      .timer-label {
        font-size: ${fontSize + 2}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing * 2}px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .countdown-timer {
        display: flex;
        justify-content: center;
        gap: ${spacing * 2}px;
        margin-bottom: ${spacing * 2}px;
      }
      
      .timer-unit {
        background: ${color1};
        border: 3px solid ${color3};
        border-radius: ${radius}px;
        padding: ${spacing * 2}px ${spacing * 3}px;
        min-width: 100px;
        box-shadow: 0 4px 12px ${color11};
        transition: all 0.3s;
      }
      
      .timer-unit:hover {
        transform: translateY(-5px);
        border-color: ${color4};
        box-shadow: 0 8px 20px ${color11};
      }
      
      .timer-value {
        font-size: ${fontSize * 3}px;
        font-weight: 800;
        color: ${color4};
        display: block;
        font-variant-numeric: tabular-nums;
        animation: flipNumber 0.6s ease;
      }
      
      .timer-unit-label {
        font-size: ${fontSize - 2}px;
        color: ${color7};
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: ${spacing / 2}px;
        display: block;
      }
      
      .deal-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${spacing}px ${spacing * 2}px;
        background: ${color2};
        border-radius: ${radius}px;
        margin-top: ${spacing * 2}px;
      }
      
      .deal-number {
        font-size: ${fontSize}px;
        color: ${color7};
        font-weight: 600;
      }
      
      .deal-timezone {
        font-size: ${fontSize - 2}px;
        color: ${color7};
      }
      
      .progress-indicator {
        display: flex;
        gap: ${spacing / 2}px;
        justify-content: center;
        margin-top: ${spacing * 2}px;
      }
      
      .progress-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${color3};
        transition: all 0.3s;
      }
      
      .progress-dot.active {
        background: ${color4};
        transform: scale(1.3);
        box-shadow: 0 0 10px ${color4}60;
      }
      
      .no-deals {
        text-align: center;
        padding: ${spacing * 4}px;
        color: ${color7};
      }
      
      .no-deals-title {
        font-size: ${fontSize * 2}px;
        font-weight: 700;
        color: ${color6};
        margin-bottom: ${spacing}px;
      }
      
      .no-deals-text {
        font-size: ${fontSize + 2}px;
      }
      
      @keyframes slideIn {
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
      
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) translateY(-100%);
        }
        100% {
          transform: translateX(100%) translateY(100%);
        }
      }
      
      @keyframes flipNumber {
        0% {
          transform: rotateX(0deg);
        }
        50% {
          transform: rotateX(90deg);
        }
        100% {
          transform: rotateX(0deg);
        }
      }
      
      @media (max-width: 768px) {
        .deal-content {
          grid-template-columns: 1fr;
        }
        
        .countdown-timer {
          flex-wrap: wrap;
          gap: ${spacing}px;
        }
        
        .timer-unit {
          min-width: 80px;
          padding: ${spacing}px ${spacing * 2}px;
        }
        
        .timer-value {
          font-size: ${fontSize * 2}px;
        }
        
        .deal-title {
          font-size: ${fontSize + 4}px;
        }
        
        .product-name {
          font-size: ${fontSize + 2}px;
        }
        
        .current-price {
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

  calculateDiscount(originalPrice, salePrice) {
    if (!originalPrice || !salePrice) return 0;
    
    const original = this.parsePrice(originalPrice);
    const sale = this.parsePrice(salePrice);
    
    if (original <= 0 || sale <= 0 || sale >= original) return 0;
    
    return Math.round(((original - sale) / original) * 100);
  }

  parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const numStr = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(numStr) || 0;
  }

  render() {
    if (!this.products || this.products.length === 0) {
      this.innerHTML = `
        <style>${this.getStyles()}</style>
        <div class="ticker-container">
          <div class="ticker-wrapper">
            <div class="no-deals">
              <div class="no-deals-title">No Daily Deals</div>
              <div class="no-deals-text">Configure your daily deals to get started</div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const currentProduct = this.products[this.currentDealIndex];
    if (!currentProduct) {
      this.render();
      return;
    }

    const imageUrl = currentProduct.media?.mainMedia?.image?.url || '';
    const hasDiscount = currentProduct.priceData?.formatted?.discountedPrice && 
                        currentProduct.priceData?.formatted?.discountedPrice !== currentProduct.priceData?.formatted?.price;
    
    const discountPercent = hasDiscount ? 
      this.calculateDiscount(currentProduct.priceData?.formatted?.price, currentProduct.priceData?.formatted?.discountedPrice) : 0;

    const time = this.getTimeUntilNextDeal();

    this.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="ticker-container">
        <div class="ticker-wrapper">
          <div class="deal-card">
            <div class="deal-header">
              <div class="flash-badge">${this.styleProps.text10}</div>
              <h1 class="deal-title">${this.styleProps.text1}</h1>
              <p class="deal-subtitle">${this.styleProps.text2}</p>
            </div>
            
            <div class="deal-content">
              <div class="product-section">
                <div class="product-image-container">
                  ${imageUrl ? `<img class="product-image" src="${this.optimizeImageUrl(imageUrl, 600, 600)}" alt="${currentProduct.name}">` : ''}
                  ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
                </div>
                
                <div class="product-details">
                  <h2 class="product-name">${currentProduct.name}</h2>
                  ${currentProduct.description ? `
                    <p class="product-description">${currentProduct.description.substring(0, 150)}...</p>
                  ` : ''}
                  
                  <div class="price-section">
                    <div class="price-label">Today's Price</div>
                    <div class="price-display">
                      <span class="current-price">${hasDiscount ? currentProduct.priceData.formatted.discountedPrice : currentProduct.priceData?.formatted?.price || 'N/A'}</span>
                      ${hasDiscount ? `
                        <span class="original-price">${currentProduct.priceData.formatted.price}</span>
                        <span class="savings-amount">Save ${discountPercent}%</span>
                      ` : ''}
                    </div>
                  </div>
                  
                  <button class="cta-button" data-product-id="${currentProduct._id}">${this.styleProps.text3}</button>
                </div>
              </div>
              
              <div class="timer-section">
                <div class="timer-label">${this.styleProps.text4}</div>
                
                <div class="countdown-timer">
                  <div class="timer-unit">
                    <span class="timer-value timer-hours">${String(time.hours).padStart(2, '0')}</span>
                    <span class="timer-unit-label">${this.styleProps.text6}</span>
                  </div>
                  <div class="timer-unit">
                    <span class="timer-value timer-minutes">${String(time.minutes).padStart(2, '0')}</span>
                    <span class="timer-unit-label">${this.styleProps.text7}</span>
                  </div>
                  <div class="timer-unit">
                    <span class="timer-value timer-seconds">${String(time.seconds).padStart(2, '0')}</span>
                    <span class="timer-unit-label">${this.styleProps.text8}</span>
                  </div>
                </div>
                
                <div class="deal-info">
                  <span class="deal-number">Deal ${this.currentDealIndex + 1} of ${this.products.length}</span>
                  <span class="deal-timezone">${this.timezone}</span>
                </div>
                
                ${this.products.length > 1 ? `
                  <div class="progress-indicator">
                    ${this.products.map((_, index) => `
                      <div class="progress-dot ${index === this.currentDealIndex ? 'active' : ''}"></div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const ctaButton = this.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        const productId = ctaButton.dataset.productId;
        this.dispatchEvent(new CustomEvent('shopNow', {
          detail: { productId }
        }));
      });
    }
  }
}

customElements.define('daily-deal-ticker-element', DailyDealTickerElement);
