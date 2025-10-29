
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar } from "lucide-react";

export const NewsSection = () => {
  // Mock news data - will be replaced with RSS feed or API integration
  const mockNews = [
    {
      title: "MTA Reports Initial Congestion Pricing Results",
      summary: "Early data shows traffic reduction in Manhattan's central business district following implementation.",
      date: "January 10, 2025",
      source: "MTA Official",
      url: "#"
    },
    {
      title: "NY State Updates on Revenue Collection",
      summary: "First week revenue figures released, showing alignment with projected estimates.",
      date: "January 8, 2025", 
      source: "NY State DOT",
      url: "#"
    },
    {
      title: "Commuter Response Survey Results",
      summary: "Survey of 10,000+ commuters reveals changing travel patterns and mode preferences.",
      date: "January 6, 2025",
      source: "Regional Plan Association", 
      url: "#"
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          Latest from NY State
        </CardTitle>
        <CardDescription className="text-gray-400">
          Official updates and announcements about congestion pricing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNews.map((article, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{article.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-500 hover:text-blue-400 transition-colors cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All Official Updates →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
