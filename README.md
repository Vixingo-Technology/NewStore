# Nuvion - Premium Soccer Jersey E-commerce

A modern, full-stack e-commerce website for soccer jerseys built with Next.js 14, TypeScript, TailwindCSS, and Stripe integration.

## Features

- **Modern UI/UX**: Clean, responsive design with TailwindCSS
- **Product Catalog**: Browse jerseys by category, brand, size, and price
- **Product Details**: Image gallery, size selection, and detailed product information
- **Shopping Cart**: Add, remove, and update quantities with persistent storage
- **Secure Checkout**: Stripe integration for secure payment processing
- **Responsive Design**: Mobile-first approach with desktop optimization
- **TypeScript**: Full type safety throughout the application
- **Performance**: Optimized with Next.js 14 App Router
- **Robust Scraping**: Enhanced Yupoo scraper with proper image downloading
- **Cloudinary Integration**: Optional cloud image hosting for better performance
- **Intelligent Enrichment**: Automatic product categorization and pricing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Payment**: Stripe
- **State Management**: React Context API
- **Utilities**: clsx, tailwind-merge
- **Scraping**: Playwright, gallery-dl (Python fallback)
- **Image Hosting**: Cloudinary (optional)
- **Browser Automation**: Playwright

##  Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)
- Optional: Cloudinary account (for image hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nuvion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## Pages & Features

### Home Page (`/`)
- Hero section with call-to-action
- Featured products grid
- Category navigation
- Trust indicators

### Products Page (`/products`)
- Product grid with filters
- Search functionality
- Category, brand, size, and price filters
- Grid/list view toggle

### Product Detail (`/products/[id]`)
- Image gallery with thumbnails
- Size selection
- Quantity picker
- Add to cart functionality
- Product information and reviews

### Shopping Cart (`/cart`)
- Cart item list
- Quantity adjustment
- Remove items
- Order summary
- Proceed to checkout

### Checkout (`/checkout`)
- Customer information form
- Shipping address
- Order summary
- Stripe payment integration

### Success Page (`/checkout/success`)
- Order confirmation
- Next steps information
- Continue shopping links

##  Styling

The project uses TailwindCSS for styling with a custom design system:

- **Colors**: Blue primary (#2563eb), gray scale
- **Typography**: Inter font family
- **Components**: Card-based layout with shadows and rounded corners
- **Responsive**: Mobile-first with breakpoints for tablet and desktop

##  Security

- Stripe handles all payment processing
- No sensitive data stored locally
- Environment variables for API keys
- Input validation on forms


##  License

This project is licensed under the MIT License.

