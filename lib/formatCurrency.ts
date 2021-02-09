export function formatNumberToCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(
      +amount
    );
  }