export default function LoveStory() {
  const events = [
    {
      title: "Memorable Moment",
      date: "January 2020",
      description:
        "We first met at a mutual friend's birthday party. Brandon spilled his drink on Meyca's dress, and that's how our conversation started.",
    },
    {
      title: "First Date",
      date: "February 2020",
      description:
        "Our first date was at a small coffee shop downtown. We talked for hours and didn't realize how much time had passed.",
    },
    {
      title: "Engagement Day",
      date: "December 2023",
      description:
        "Brandon proposed during our vacation in Bali. It was sunset, and we were walking along the beach when he got down on one knee.",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-16">
        {events.map((event, index) => (
          <div key={index} className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
            <div className="w-1/2 px-4">
              <div className={`text-right ${index % 2 !== 0 ? "text-left" : ""}`}>
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{event.date}</p>
              </div>
            </div>
            <div className="w-1/2 px-4">
              <div className={`text-left ${index % 2 !== 0 ? "text-right" : ""}`}>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
