// Secure Payment Gateway compatibility wrapper
export * from './paymentGateway';
export {
  type PaymentGatewayStatus as DodoGatewayStatus,
  type CheckoutRequest as DodoCheckoutRequest,
  type CheckoutResponse as DodoCheckoutResponse,
  type TransactionRecord as DodoTransactionRecord,
  getPaymentGatewayStatus as getDodoGatewayStatus,
  createCheckoutSession as createDodoCheckoutSession,
  verifyPaymentSession as verifyDodoSession,
  testGatewayKey as testDodoKey,
} from './paymentGateway';
