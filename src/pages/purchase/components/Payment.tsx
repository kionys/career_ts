import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';

import { useCart } from '@/core/hooks/use-carts';
import { PaymentMethodTableRow } from '@/pages/purchase/components/PaymentMethodTableRow';
import { formatPrice } from '@/utils/formatter';

interface PaymentProps {
  paymentMethod: string;
  onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Payment = ({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentProps) => {
  const { cart } = useCart();
  const shippingCost = 3000;

  const getTotalPrice = () => {
    return formatPrice(cart.totalPrice + shippingCost);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-6 h-6 mr-2" />
          결제정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">총상품가격</TableCell>
              <TableCell>{formatPrice(cart.totalPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">배송비</TableCell>
              <TableCell>{formatPrice(shippingCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">총결제금액</TableCell>
              <TableCell>{getTotalPrice()}</TableCell>
            </TableRow>
            <PaymentMethodTableRow
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
