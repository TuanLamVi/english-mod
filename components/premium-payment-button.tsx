'use client';

import { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { PRODUCT_CONFIG } from '@/lib/product-config';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PremiumPaymentButtonProps {
  onSuccess?: () => void;
}

export function PremiumPaymentButton({ onSuccess }: PremiumPaymentButtonProps) {
  const piAuth = usePiAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const product = piAuth?.products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_69eeac81d4dd8602623f31e6
  );

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
      const sdk = window.SDKLite.init ? await window.SDKLite.init() : piAuth.sdk;
      const result = await sdk.makePurchase(product.slug);

      if (result.ok) {
        setSuccessMessage(
          `✓ Chúc mừng! Bạn đã mở khoá các tính năng nâng cao.`
        );
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
      console.error('[Premium Payment] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isPurchased) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-4 shadow-sm border border-green-200">
        <div className="flex items-center gap-2 text-green-700 font-bold">
          <CheckCircle className="w-5 h-5" />
          <span>Tính năng nâng cao đã được mở khoá</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl py-4 px-4 font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="w-5 h-5" />
        <span>{isLoading ? 'Đang xử lý...' : `Mở khoá Premium - ${product.price_in_pi} Pi`}</span>
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
        {product.description}
      </p>
    </div>
  );
}
