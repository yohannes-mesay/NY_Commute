
import { ExternalLink, Clock, MapPin, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommuterResources = () => {
  const trafficLinks = [
    {
      title: "Google Maps NYC Traffic",
      url: "https://www.google.com/maps/@40.7128,-74.0060,11z/data=!5m1!1e1",
      description: "Real-time traffic conditions across NYC"
    },
    {
      title: "MTA Service Status",
      url: "https://new.mta.info/service-status",
      description: "Live subway delays and service alerts"
    },
    {
      title: "NJ Transit Alerts",
      url: "https://www.njtransit.com/alerts",
      description: "Service status for NJ Transit rail and bus"
    }
  ];

  const planningTools = [
    {
      title: "MTA Trip Planner",
      url: "https://new.mta.info/trip-planner",
      description: "Plan your subway and bus routes"
    },
    {
      title: "NJ Transit Trip Planner",
      url: "https://www.njtransit.com/trip-planner",
      description: "Plan rail and bus trips from New Jersey"
    },
    {
      title: "Citymapper",
      url: "https://citymapper.com/nyc",
      description: "Multi-modal trip planning for NYC"
    }
  ];

  const travelTips = [
    "Commute times are consistently shortest between 10am–12pm on weekdays",
    "Evening rush hour typically extends from 4:30pm–7:00pm",
    "Tuesday through Thursday tend to have the heaviest traffic volumes",
    "Consider alternative routes during major events in Manhattan",
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Commuter Resources
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Essential tools and information to help you navigate NYC commuting efficiently
          </p>
        </div>

        <div className="space-y-8">
          {/* Real-Time Traffic & Transit Links */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-blue-400" />
                Real-Time Traffic & Transit Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Check current conditions before you travel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trafficLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{link.title}</h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-400">{link.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time-of-Day Travel Tips */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-400" />
                Data-Driven Travel Tips
              </CardTitle>
              <CardDescription className="text-gray-400">
                Based on observed traffic patterns and timing analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {travelTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <p className="text-gray-300">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Planning Tools */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-400" />
                Trip Planning Tools
              </CardTitle>
              <CardDescription className="text-gray-400">
                Plan your routes across different transit modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planningTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{tool.title}</h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-400">{tool.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stay Informed */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-400" />
                Stay Informed
              </CardTitle>
              <CardDescription className="text-gray-400">
                Keep up with the latest traffic trends and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Check back regularly for updated charts and analysis on our{" "}
                  <a href="/" className="text-blue-400 hover:underline">homepage</a> 
                  {" "}and explore cost comparisons with our{" "}
                  <a href="/cost-tool" className="text-blue-400 hover:underline">Cost Comparison Tool</a>.
                </p>
                <p className="text-gray-300">
                  Our data is updated regularly to reflect the latest traffic patterns 
                  and congestion pricing impacts across NYC commuter routes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommuterResources;
