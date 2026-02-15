# 3D Design Integration Guide - Toodies E-Commerce Platform

## Overview
The Toodies platform integrates with external 3D designer tools to allow customers to create custom designs for t-shirts, hoodies, and sweatshirts. This guide explains how the integration works.

---

## Current Integration Workflow

### 1. **Customer Starts Design Process**
- Customer browses products on Toodies website
- Clicks "Launch 3D Studio" button
- Gets redirected to external 3D designer website

### 2. **External 3D Designer Tool**
The external 3D designer (which you'll integrate separately) should:
- Allow users to customize products (add text, images, colors, etc.)
- Provide a 3D preview of the design
- Save/export the design to a URL or generate a design file
- **Important**: The designer must return data back to Toodies

### 3. **Return URL Mechanism**
When customer finishes designing, the external 3D tool should redirect back to Toodies with design data in URL parameters:

```
https://your-toodies-website.com/?designUrl=DESIGN_FILE_URL&productId=PRODUCT_ID&designName=CUSTOM_NAME
```

**URL Parameters:**
- `designUrl` - URL to the saved design file/image (required)
- `productId` - ID of the product being customized (optional)
- `designName` - Custom name for the design (optional)

### 4. **Toodies Receives Design**
The Toodies platform automatically:
- Detects the `designUrl` parameter in the URL
- Creates a `CustomDesign` object
- Saves it to the customer's "Studio" (saved designs)
- Shows success notification

**Code Reference (App.tsx):**
```typescript
const handleDesignUrlFromParams = (urlParams: URLSearchParams, user: User) => {
  const designUrl = urlParams.get('designUrl');
  const productId = urlParams.get('productId');
  const designName = urlParams.get('designName');
  
  if (designUrl) {
    const newDesign: CustomDesign = {
      id: Date.now().toString(),
      name: designName || `Custom Design - ${new Date().toLocaleDateString()}`,
      designUrl: designUrl,
      productId: productId || '1',
      createdAt: new Date().toISOString(),
    };
    
    // Save to user's account
    const updatedUser = {
      ...user,
      savedDesigns: [...(user.savedDesigns || []), newDesign]
    };
    storageUtils.updateCurrentUser(updatedUser);
  }
};
```

### 5. **Customer Adds to Cart**
- Customer goes to "Studio" tab
- Views saved designs
- Clicks "Add to Cart" on any design
- Design URL is attached to the cart item

**Data Structure:**
```typescript
interface CartItem {
  productId: string;
  variationId: string;
  quantity: number;
  customDesignUrl?: string; // 3D design link
}
```

### 6. **Order Processing**
When customer checks out:
- Cart items with `customDesignUrl` are marked as custom designs
- Admin receives the design URL in order details
- Admin can download/view the design file
- Design is sent to production

---

## Data Flow Diagram

```
┌─────────────┐
│   Customer  │
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Click "Launch 3D Studio"
       │
       ▼
┌─────────────────────┐
│  External 3D Tool   │
│  (Your Designer)    │
│                     │
│  - Customize        │
│  - Preview          │
│  - Save Design      │
└──────┬──────────────┘
       │
       │ 2. Redirect with design URL
       │    ?designUrl=...&productId=...
       │
       ▼
┌─────────────────────┐
│  Toodies Platform   │
│                     │
│  - Auto-detect URL  │
│  - Save to Studio   │
│  - Show Success     │
└──────┬──────────────┘
       │
       │ 3. Customer views in Studio
       │
       ▼
┌─────────────────────┐
│   Add to Cart       │
│   (with design URL) │
└──────┬──────────────┘
       │
       │ 4. Checkout & Order
       │
       ▼
┌─────────────────────┐
│   Admin Panel       │
│   (View/Download)   │
└─────────────────────┘
```

---

## Integration Methods

### Method 1: URL Return (Current Implementation) ✅
**Best for**: Simple integrations, hosted 3D tools

The 3D designer redirects back with URL parameters:
```javascript
// In your 3D designer tool:
const designUrl = "https://cdn.example.com/designs/abc123.png";
const returnUrl = `https://toodies.com/?designUrl=${encodeURIComponent(designUrl)}&productId=T001`;
window.location.href = returnUrl;
```

### Method 2: PostMessage API (Advanced)
**Best for**: Embedded 3D tools via iframe

```javascript
// In your 3D designer (inside iframe):
window.parent.postMessage({
  type: 'DESIGN_COMPLETE',
  designUrl: 'https://cdn.example.com/designs/abc123.png',
  productId: 'T001',
  thumbnailUrl: 'https://cdn.example.com/thumbs/abc123.jpg'
}, 'https://toodies.com');

// In Toodies (to receive message):
window.addEventListener('message', (event) => {
  if (event.data.type === 'DESIGN_COMPLETE') {
    // Save design
    saveCustomDesign(event.data);
  }
});
```

### Method 3: API Integration (For WooCommerce)
When migrating to WooCommerce, you can use REST API:

```javascript
// 3D Designer saves to Toodies API
fetch('https://toodies.com/wp-json/toodies/v1/designs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer USER_TOKEN'
  },
  body: JSON.stringify({
    userId: 'user123',
    productId: 'T001',
    designUrl: 'https://cdn.example.com/designs/abc123.png',
    designName: 'My Cool Design'
  })
});
```

---

## What Data Should the 3D Designer Provide?

### Required Data:
1. **Design File URL** (`designUrl`)
   - Must be a publicly accessible URL
   - Formats: PNG, JPG, PDF, or custom format
   - Should be high-resolution for printing

2. **Product Reference** (`productId`)
   - Match to Toodies product catalog
   - Ensures design is linked to correct product

### Optional Data:
3. **Thumbnail Preview** (`thumbnailUrl`)
   - Smaller preview image
   - For displaying in cart/studio

4. **Design Metadata**
   - Colors used
   - Print areas (front, back, sleeves)
   - Special instructions
   - File format info

---

## Example: Full Integration Flow

### Step 1: Customer Clicks "Launch 3D Studio"
```typescript
// In CustomerDashboard.tsx
const handleDesignerClick = () => {
  if (designerUrl) {
    // Open configured 3D designer URL
    window.open(designerUrl, '_blank');
  }
};
```

### Step 2: 3D Designer Configuration
Admin sets the 3D designer URL in admin panel:
```
Settings → Enter 3D Designer URL: https://3ddesigner.example.com
```

The 3D designer should accept product data in URL:
```
https://3ddesigner.example.com?returnUrl=https://toodies.com&productId=T001
```

### Step 3: Customer Creates Design
Customer uses external 3D tool to:
- Choose colors
- Add text/graphics
- Preview in 3D
- Save design

### Step 4: Design Returns to Toodies
3D tool redirects:
```
https://toodies.com/?designUrl=https://storage.3ddesigner.com/user123/design456.png&productId=T001&designName=Awesome%20Shirt
```

### Step 5: Toodies Auto-Saves
Platform detects URL parameters and saves design automatically.

### Step 6: Customer Checkout
Design URL is included in order data for admin to access.

---

## Admin Panel - Design Access

Admins can access customer designs in multiple places:

### 1. Order Details
```
Order #12345
- Product: T-Shirt (Red, Large)
- Quantity: 1
- Custom Design: [View Design] [Download PDF]
```

### 2. Customer Management
```
Customer: John Doe
Saved Designs:
- Design #1: Awesome Shirt [View]
- Design #2: Cool Hoodie [View]
```

---

## WooCommerce Migration Plan

When migrating to WooCommerce:

### 1. Install Custom Plugin
Create a WordPress plugin to handle:
- Design URL storage in order meta
- Design file management
- PDF generation for production

### 2. Product Customizer Field
Add custom fields to WooCommerce products:
```php
// In product page
add_action('woocommerce_before_add_to_cart_button', 'add_design_field');
function add_design_field() {
    echo '<input type="url" name="custom_design_url" placeholder="Paste design URL">';
}
```

### 3. Save Design with Order
```php
// Save to order meta
add_action('woocommerce_add_order_item_meta', 'save_design_to_order');
function save_design_to_order($item_id, $values) {
    if (!empty($values['custom_design_url'])) {
        wc_add_order_item_meta($item_id, '_custom_design_url', $values['custom_design_url']);
    }
}
```

### 4. Display in Admin
```php
// Show in order details
add_action('woocommerce_admin_order_data_after_billing_address', 'display_custom_design');
function display_custom_design($order) {
    $design_url = get_post_meta($order->get_id(), '_custom_design_url', true);
    if ($design_url) {
        echo '<p><strong>Custom Design:</strong> <a href="'.$design_url.'" target="_blank">View Design</a></p>';
    }
}
```

---

## Security Considerations

### 1. URL Validation
Always validate design URLs:
```typescript
const isValidDesignUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') return false;
    // Whitelist allowed domains
    const allowedDomains = ['cdn.3ddesigner.com', 'storage.designtool.com'];
    return allowedDomains.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
};
```

### 2. File Type Restrictions
Only accept specific file types:
- Images: PNG, JPG, JPEG
- Vectors: SVG, PDF
- 3D Models: OBJ, STL (if applicable)

### 3. File Size Limits
Implement size limits to prevent abuse:
- Maximum file size: 10MB for images
- Maximum file size: 50MB for 3D models

---

## Recommended 3D Designer Tools

### Option 1: Custom Builder (Recommended)
Build your own using:
- **Three.js** - 3D rendering
- **Fabric.js** - 2D canvas for designs
- **HTML2Canvas** - Export designs

### Option 2: Third-Party Services
- **Zakeke** - WooCommerce compatible
- **Customily** - Shopify/WooCommerce
- **Printful Design Maker** - Print-on-demand
- **InkyPixels** - Custom product designer

### Option 3: Open Source
- **Product Designer** (WordPress plugin)
- **Fancy Product Designer** (Premium, but worth it)

---

## Testing the Integration

### Test Checklist:
- [ ] 3D designer opens in new tab
- [ ] Customer can create design
- [ ] Design URL returns correctly
- [ ] Design saves to customer's Studio
- [ ] Design shows in cart with indicator
- [ ] Design URL included in order
- [ ] Admin can view/download design
- [ ] Design URL works in invoice/PDF

### Sample Test URLs:
```
// Test with sample design
https://toodies.com/?designUrl=https://via.placeholder.com/1000x1000.png?text=Test+Design&productId=1&designName=Test+Shirt

// Test with multiple products
https://toodies.com/?designUrl=https://example.com/design.png&productId=T001,H002
```

---

## Common Issues & Solutions

### Issue 1: Design URL Not Detected
**Solution**: Ensure URL parameter is named exactly `designUrl` (case-sensitive)

### Issue 2: Design Not Saving
**Solution**: Check browser localStorage limits (usually 5-10MB). Consider using sessionStorage for temporary data.

### Issue 3: CORS Errors
**Solution**: Ensure 3D designer website allows cross-origin requests:
```
Access-Control-Allow-Origin: https://toodies.com
```

### Issue 4: Design Preview Not Loading
**Solution**: Make sure design URL is publicly accessible and uses HTTPS.

---

## Future Enhancements

### Phase 1: Current (URL-based)
✅ Manual URL input
✅ Save to Studio
✅ Add to cart
✅ Include in orders

### Phase 2: Enhanced Integration
- [ ] Embedded 3D designer (iframe)
- [ ] Real-time preview in cart
- [ ] Multiple design angles (front, back)
- [ ] Design versioning

### Phase 3: Advanced Features
- [ ] AI design suggestions
- [ ] Design templates library
- [ ] Social design sharing
- [ ] Design marketplace

### Phase 4: Production Integration
- [ ] Auto-generate print files
- [ ] Direct-to-printer API
- [ ] Quality checks
- [ ] Mockup generation

---

## Support & Documentation

For questions about the integration:
1. Check this guide first
2. Review code in `/App.tsx` and `/components/CustomerDashboard.tsx`
3. Test with sample URLs
4. Contact development team

**Last Updated**: February 10, 2026
**Version**: 1.0
