
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Database, Target, Users, Calendar, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Info className="h-10 w-10 text-blue-400" />
            About This Project
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Understanding the real-world impact of NYC's congestion pricing through comprehensive traffic data analysis.
          </p>
        </div>

        <div className="space-y-8">
          {/* What is Congestion Pricing */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-400" />
                What is Congestion Pricing?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Congestion pricing is a traffic management strategy that charges drivers a fee to enter high-traffic areas during peak times. New York City implemented its congestion pricing program on January 5, 2025, making it the first major U.S. city to adopt this approach.
              </p>
              <p>
                The program charges vehicles entering Manhattan's Central Business District (south of 60th Street) during weekday peak hours. The primary goals are to reduce traffic congestion, improve air quality, and generate revenue for public transportation improvements.
              </p>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Key Details:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Implementation Date: January 5, 2025</li>
                  <li>• Peak Hours: Weekdays 5:00 AM - 9:00 PM, Weekends 9:00 AM - 9:00 PM</li>
                  <li>• Standard Car Fee: $15 (peak), $3.75 (off-peak)</li>
                  <li>• Coverage Area: Manhattan below 60th Street</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How it Works in NYC */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                How It Works in NYC
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                NYC's congestion pricing system uses electronic toll collection technology similar to E-ZPass. Cameras and sensors detect vehicles entering the congestion zone and automatically charge registered accounts or mail bills to vehicle owners.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Technology</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Automatic license plate recognition</li>
                    <li>• E-ZPass integration</li>
                    <li>• Real-time pricing updates</li>
                    <li>• Mobile app notifications</li>
                  </ul>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Revenue Use</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• MTA capital improvements</li>
                    <li>• Subway modernization</li>
                    <li>• Bus rapid transit expansion</li>
                    <li>• Accessibility upgrades</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purpose of This Site */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-6 w-6 text-purple-400" />
                Purpose of This Site
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                This website provides independent, data-driven analysis of congestion pricing's impact on NYC-area traffic patterns. We began collecting traffic data months before implementation to establish baseline measurements and track changes over time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">Transparency</div>
                  <p className="text-sm">Open access to traffic data and analysis methodology</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">Objectivity</div>
                  <p className="text-sm">Independent analysis free from political or commercial bias</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">Accessibility</div>
                  <p className="text-sm">Easy-to-understand visualizations for all audiences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Who Built It */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-yellow-400" />
                Who Built This & How Data is Collected
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                This project was developed by transportation researchers and data analysts committed to providing transparent information about urban mobility policies. Our team combines expertise in traffic engineering, data science, and public policy analysis.
              </p>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Data Collection Methodology:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Automated Traffic Monitoring:</strong> Real-time traffic duration data collected every 15 minutes</li>
                  <li>• <strong>Six Key Routes:</strong> Representative commuter corridors from Connecticut, New Jersey, and Long Island</li>
                  <li>• <strong>Weather Integration:</strong> Traffic data correlated with weather conditions and special events</li>
                  <li>• <strong>Quality Assurance:</strong> Data validation and anomaly detection to ensure accuracy</li>
                </ul>
              </div>
              
              <p>
                All data collection complies with privacy regulations and focuses on aggregate traffic patterns rather than individual vehicle tracking. Our methodology is transparent and available for peer review.
              </p>
            </CardContent>
          </Card>

          {/* Timeline & Data Transparency */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-6 w-6 text-red-400" />
                Timeline & Data Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-white">October 2024</h4>
                  <p className="text-sm">Data collection begins on six major commuter routes</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-white">December 2024</h4>
                  <p className="text-sm">Website development and initial analysis tools completed</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-white">January 5, 2025</h4>
                  <p className="text-sm">Congestion pricing implementation begins</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-white">Ongoing</h4>
                  <p className="text-sm">Continuous monitoring and analysis of traffic patterns</p>
                </div>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg mt-6">
                <h4 className="font-semibold text-white mb-2">Data Transparency Commitment:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• All aggregated datasets available for download</li>
                  <li>• Analysis methodology fully documented</li>
                  <li>• Regular updates on data collection status</li>
                  <li>• Open source visualization tools</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
