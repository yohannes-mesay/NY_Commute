
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficChart } from "@/components/TrafficChart";
import { NewsSection } from "@/components/NewsSection";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<'morning' | 'afternoon'>('morning');

  return (
    <div className="min-h-screen pt-16">
      {/* NYC Street Grid Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              NYC Congestion Pricing Traffic Analysis
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                New York City made headlines as the first city to implement congestion pricing in the United States. We aim to provide insights into how congestion pricing is shaping New York commuting and traffic. We've tracked NYC commute durations for months as a baseline, and now offer a real-time, data-driven view of how travel times are changing across key routes to help commuters and policymakers understand its impact.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Last updated: {new Date().toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Core Traffic Analysis Section */}
        <section className="mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl text-white">Commute Duration Over Time by Route</CardTitle>
                  <CardDescription className="text-gray-400">
                    Average daily commute time over time, separated into pre- and post-congestion pricing (January 5, 2025). 
                    Data is shown only for weekdays and US federal bank holidays are excluded.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={timeFilter === 'morning' ? 'default' : 'outline'}
                    onClick={() => setTimeFilter('morning')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Morning
                  </Button>
                  <Button 
                    variant={timeFilter === 'afternoon' ? 'default' : 'outline'}
                    onClick={() => setTimeFilter('afternoon')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Afternoon
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrafficChart timeFilter={timeFilter} />
            </CardContent>
          </Card>
        </section>

        {/* News Section */}
        <section className="mb-12">
          <NewsSection />
        </section>

        {/* Additional Chart Placeholders */}
        <section className="space-y-8">
          {[2, 3, 4].map((chartNum) => (
            <Card key={chartNum} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Chart {chartNum}</CardTitle>
                <CardDescription className="text-gray-400">
                  Placeholder for future traffic analysis visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart {chartNum} - Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
