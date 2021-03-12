import React, { useContext } from "react";
import {useRouter} from "next/router";
import { ResponsivePie } from "@nivo/pie";
import { MyAppContext } from "../store";
import formatNumberToCurrency from "../lib/formatCurrency";
const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  const { currency, AppMainLinks } = useContext(MyAppContext);
  const router = useRouter();
  const { type } = router.query;
  let total = 0;
  dataWithArc.forEach((datum) => {
    total += datum.value;
  });

  return (
    <>
      <text x={centerX - 45} y={centerY - 20}>
       {`Total ${type}`}
      </text>
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "22px",
          fontWeight: 600,
          fill: "#555",
        }}
      >
        {formatNumberToCurrency(total, currency)}
      </text>
    </>
  );
};
export default function PieWidget({ summary, trxType }) {
  const { currency } = useContext(MyAppContext);
  const data = [
    { id: "Recurring", value: summary.totalRecurring },
    { id: "Non-Recurring", value: summary.totalOnce },
  ];
  return (
    <ResponsivePie
      theme={{ fontSize: 13 }}
      data={data}
      //   enableRadialLabels={false}
      radialLabelsLinkHorizontalLength={17}
      radialLabelsTextXOffset={5}
      radialLabelsLinkDiagonalLength={17}
      sliceLabel={({ value }) =>
        `${value ? formatNumberToCurrency(value, currency) : ""}`
      }
      innerRadius={0.5}
      colors={{ scheme: "set2" }}
      layers={[
        "slices",
        "sliceLabels",
        "radialLabels",
        "legends",
        CenteredMetric,
      ]}
      legends={[
        {
          anchor: "right",
          direction: "column",
          itemWidth: 130,
          itemHeight: 20,
        },
      ]}
    />
  );
}
