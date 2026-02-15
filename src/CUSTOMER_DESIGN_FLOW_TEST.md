# 🎨 Customer 2D Design Flow - Testing Guide

## ✅ COMPLETE FLOW FROM ADMIN TO CUSTOMER

### **Step 1: Admin Uploads Product & Mockup**

1. Login as **Admin** (password: `9886510858@Tcbadmin`)
2. Go to **Products** tab
3. Click **"+ Add Product"**
4. Fill in:
   - Name: "Oversized T-Shirt"
   - Category: "T-Shirts"
   - Gender: "Unisex"
   - Description: "Premium oversized tee"
   - Add variations (colors, sizes, prices)
   - **Upload product images**
5. Click **Save**

### **Step 2: Admin Configures 2D Model**

1. Still in Admin Dashboard
2. Go to **2D Models** tab (or "Design Models")
3. Click **"Configure New Model"**
4. Select the product you just created
5. **Upload Mockup Image** (this is the ACTUAL t-shirt template/mockup)
   - This should be a flat lay or mannequin image showing where designs go
   - Example: Front view of blank t-shirt
6. Configure:
   - Available colors
   - Available sizes  
   - Fabrics
   - **Printing Methods** with costs:
     - Screen Print: ₹15/sq.inch, Min: ₹100
     - DTG Print: ₹25/sq.inch, Min: ₹150
     - Vinyl Print: ₹20/sq.inch, Min: ₹120
7. Click **Save Model Configuration**

### **Step 3: Customer Creates Design**

1. **Logout** from admin
2. **Login as Customer** (or create new account)
3. Go to **Shop** tab
4. Find the "Oversized T-Shirt" product
5. Click **"Create 2D Design"** button (purple/pink gradient)
   - ⚠️ If this button doesn't appear, admin didn't configure the model!
6. **2D Designer Opens** showing:
   - ✅ Admin's mockup image as background
   - ✅ Product name in header
   - ✅ Product options (color, size, fabric)
   - ✅ Printing methods configured by admin

### **Step 4: Customer Uploads Their Design**

1. In designer, **select a Printing Method** (dropdown)
2. Click **"Upload Design"** button
3. **Choose customer's own image** (logo, artwork, photo, etc.)
4. Image appears on canvas over the mockup
5. **Position/Scale/Rotate** the design using drag handles
6. Watch **cost calculate in real-time** based on:
   - Design size (square inches)
   - Selected printing method
7. Click **Grid button** to see print area overlay
8. Add **multiple layers** if needed (repeat upload)

### **Step 5: Save & Purchase**

1. Click **"Save Design"** button
2. Design saves to customer's **Studio** tab
3. Navigate to **Studio** tab
4. See saved design with:
   - Preview image
   - Product details
   - Total price (base + printing)
5. Click **"Add to Cart"**
6. Go to cart → Checkout → Payment

---

## 🔍 **TROUBLESHOOTING**

### Problem: "Create 2D Design" button doesn't appear on product
**Solution:** Admin hasn't configured 2D model for that product yet. Go to Admin → 2D Models → Configure it.

### Problem: Designer shows error "Design model not configured"
**Solution:** The model config exists but might be missing the mockup image. Re-upload in Admin → 2D Models.

### Problem: Customer can't upload design
**Solution:** Make sure customer selected a printing method FIRST before clicking upload.

### Problem: Mockup doesn't show in designer
**Solution:** Check that admin uploaded a valid mockup image URL in the model configuration.

---

## 🎯 **KEY POINTS**

1. **Admin uploads PRODUCT** (this is what customers buy)
2. **Admin configures 2D MODEL** (this is the mockup template + print settings)
3. **Customer uploads DESIGN** (this is their artwork/image that goes ON the mockup)
4. **Three separate things:**
   - Product image = thumbnail in shop
   - Mockup image = template in designer
   - Customer design = their uploaded artwork

---

## 📦 **WHAT GETS SAVED**

When customer saves design:
- ✅ Full resolution export (2400x2400) - perfect quality
- ✅ Preview export (600x600) - for thumbnail
- ✅ All layer data with positions
- ✅ Selected options (color, size, fabric)
- ✅ Printing cost calculation
- ✅ Payment status tracking

---

## 🚀 **READY TO TEST!**

Follow steps 1-5 above to test the complete flow from admin upload to customer purchase.
