'use client';

import { useEffect } from 'react';

// If using TypeScript, add the following snippet to your file as well.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface PricingProps {
  customerEmail: string;
}

const Pricing = ({ customerEmail }: PricingProps) => {
   useEffect(() => {
     const script = document.createElement('script');
     script.src = 'https://js.stripe.com/v3/pricing-table.js';
     script.async = true;
     
     // Add script to document
     document.body.appendChild(script);
     
     // Cleanup function
     return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
   };
   }, []); // Empty dependency array means this runs once on mount
  return (
     <div className="w-full max-w-6xl mx-auto">
      <stripe-pricing-table 
      pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
      publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      customer-email={customerEmail}
      />
     </div>
   );
};
export default Pricing;