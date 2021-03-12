import { ResponsivePie } from "@nivo/pie";
import formatNumberToCurrency from "../lib/formatCurrency";
export default function IndexPieWidget({ currency, summary }) {
  console.log(summary);
  const data = [
    {
      id: "Total Expenses",
      value: summary.totalExpense,
      color: "hsl(0, 100%, 50%)",
    },
    {
      id: "Total Income",
      value: summary.totalIncome,
      color: "#03c048",
    },
  ];
  return (
    <ResponsivePie
      data={data}
      sliceLabel={({ value }) =>
        `${value ? formatNumberToCurrency(value, currency) : ""}`
      }
      innerRadius={0.4}
      colors={{ datum: "data.color" }}
      sliceLabelsTextColor="#fff"
      padAngle={0.5}
      cornerRadius={5}
      radialLabelsLinkColor={{
        from: "color",
      }}
      radialLabelsLinkStrokeWidth={4}
      radialLabelsTextColor={{
        from: "color",
      }}
    />
  );
}
