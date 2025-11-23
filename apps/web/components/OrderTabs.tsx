interface OrderTabsProps {
  orderType: "LIMIT" | "MARKET";
  setOrderType: (type: "LIMIT" | "MARKET") => void;
  side: "BUY" | "SELL";
}

export default function OrderTabs({
  orderType,
  setOrderType,
  side,
}: OrderTabsProps) {
  const isBuy = side === "BUY";
  const activeColor = isBuy ? "#4fff8a" : "#ff6464";

  return (
    <div className="flex border-b border-gray-700">
      {["LIMIT", "MARKET"].map((type) => (
        <button
          key={type}
          onClick={() => setOrderType(type as "LIMIT" | "MARKET")}
          className={`flex-1 py-2 text-sm font-medium transition-all duration-200`}
          style={{
            color: orderType === type ? activeColor : "#9ca3af",
            borderBottom:
              orderType === type
                ? `2px solid ${activeColor}`
                : "2px solid transparent",
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
