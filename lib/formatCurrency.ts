import { Prisma } from "@prisma/client";
function formatNumberToCurrency(
  amount: number | Prisma.Decimal,
  currency: string
) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(
    +amount
  );
}
export default formatNumberToCurrency;
