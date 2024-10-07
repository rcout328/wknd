import dynamic from 'next/dynamic';

const OrderConfirmationForm = dynamic(() => import('@/components/order-confirmation-form'), {
  ssr: false,
});

export default function OrderConfirmationPage() {
    return <OrderConfirmationForm />;
}