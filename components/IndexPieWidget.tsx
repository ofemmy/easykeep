import { ResponsivePie } from "@nivo/pie";
import formatNumberToCurrency from "../lib/formatCurrency";
export default function IndexPieWidget({ currency, summary }) {
  let total = summary.totalExpense+summary.totalIncome
  const data = [
    {
      id: "Expenses",
      value: ((100 * summary.totalExpense)/total).toFixed(2),
      color: "hsl(0, 100%, 50%)",
    },
    {
      id: "Income",
      value: ((100 * summary.totalIncome)/total).toFixed(2),
      color: "#03c048",
    },
  ];
  return (
    <ResponsivePie
      theme={{ fontSize: 13 }}
      enableRadialLabels={false}
      sliceLabelsSkipAngle={17}
      sliceLabelsRadiusOffset={0.5}
      //enableSliceLabels={false} //TODO show percentage
      data={data}
      sliceLabel={({ value }) =>
        `${value ? value : 0}%`
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
