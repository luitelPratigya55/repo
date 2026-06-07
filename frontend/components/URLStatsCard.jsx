// components/URLStatsCards.jsx
"use client";

export default function URLStatsCards({ stats }) {
  const cards = [
    {
      title: "Total URLs",
      value: stats.total_urls,
      
    },
    {
      title: "Total Clicks",
      value: stats.total_clicks,
      
    },
    {
      title: "Avg Clicks",
      value: stats.average_clicks,
      
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700/50"
        >
          <span className="text-3xl block mb-2">{card.icon}</span>
          <p className="text-3xl font-light text-gray-900 dark:text-white">
            {card.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {card.title}
          </p>
        </div>
      ))}
    </div>
  );
}

