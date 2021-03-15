import formatNumberToCurrency from "../lib/formatCurrency";
const PieTotalComponent = (currency,type) => (layerProps) => {
  const { centerX, centerY, dataWithArc } = layerProps;
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
          fontSize: "15px",
          fontWeight: 600,
          fill: "#555",
        }}
      >
        {formatNumberToCurrency(total, currency)}
      </text>
    </>
  );
};
export default PieTotalComponent;
