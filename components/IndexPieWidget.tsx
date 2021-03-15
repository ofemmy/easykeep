import { ResponsivePie } from "@nivo/pie";
import formatNumberToCurrency from "../lib/formatCurrency";
export default function IndexPieWidget({ currency, summary }) {
  const data = [
    {
      id: "Expenses",
      value: summary.totalExpense,
      color: "hsl(0, 100%, 50%)",
    },
    {
      id: "Income",
      value: summary.totalIncome,
      color: "#03c048",
    },
  ];
  return (
    <ResponsivePie
      theme={{ fontSize: 13 }}
      enableRadialLabels={false}
      enableSliceLabels={false} //TODO show percentage
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
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          itemWidth: 90,
          itemHeight: 20,
        },
      ]}
    />
  );
}
