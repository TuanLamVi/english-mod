'use client';

import { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { APP_PREMIUM_PRODUCT_ID } from '@/lib/product-config';
import { Lock, AlertCircle, CheckCircle, Crown } from 'lucide-react';

interface AppPremiumButtonProps {
  onSuccess?: () => void;
}

export function AppPremiumButton({ onSuccess }: AppPremiumButtonProps) {
  const piAuth = usePiAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Find the product from the products array
  const product = piAuth?.products?.find(
    (p) => p.id === APP_PREMIUM_PRODUCT_ID
  );

  // Check if product has been purchased
  const isPurchased = piAuth?.restoredPurchases?.some(
    (p) => p.productId === product?.slug
  );

  const handlePurchase = async () => {
    if (!product || !piAuth?.sdk) {
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get SDK instance
      const sdk = window.SDKLite?.init 
        ? await window.SDKLite.init() 
        : piAuth.sdk;

      // Make purchase
      const result = await sdk.makePurchase(product.slug);

      if (result.ok) {
        setSuccessMessage(
          `✓ ${product.description}`
        );
        
        // Log successful purchase details
        console.log('[App Premium Payment] Success', {
          productId: result.productId,
          paymentId: result.paymentId,
          txid: result.txid,
        });

        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setError('Thanh toán thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      const errorCode = err?.code;
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';

      if (errorCode === 'product_not_found') {
        errorMessage = 'Không tìm thấy sản phẩm.';
      } else if (errorCode === 'purchase_cancelled') {
        errorMessage = 'Thanh toán đã bị hủy.';
      } else if (errorCode === 'purchase_error') {
        errorMessage = 'Lỗi trong quá trình thanh toán.';
      }

      setError(errorMessage);
      console.error('[App Premium Payment] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If product not found, show error state
  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Không thể tải sản phẩm</span>
        </div>
      </div>
    );
  }

  // If already purchased, show success state
  if (isPurchased) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-4 shadow-sm border border-green-200">
        <div className="flex items-center gap-2 text-green-700 font-bold">
          <CheckCircle className="w-5 h-5" />
          <span>{product.description}</span>
        </div>
      </div>
    );
  }

  // Normal state - show purchase button
  return (
    <div className="space-y-3">
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl py-4 px-4 font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Crown className="w-5 h-5" />
        <span>{isLoading ? 'Đang xử lý...' : `Nâng cấp Premium - ${product.price_in_pi} Pi`}</span>
      </button>

      {error && (
        <div className="bg-red-50 rounded-2xl p-3 border border-red-200 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 rounded-2xl p-3 border border-green-200 flex gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-bold">{successMessage}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Bạn sẽ được nâng cấp bản primium
      </p>
    </div>
  );
}
