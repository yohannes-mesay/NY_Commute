-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO blog_posts (title, slug, content, author, tags, published) VALUES
(
  'First Week Analysis: Traffic Patterns Show Early Changes',
  'first-week-analysis-traffic-patterns',
  E'The implementation of congestion pricing in NYC has brought significant changes to traffic patterns across the city. Our analysis of the first week''s data reveals several key insights:\n\n## Key Findings\n\n### Morning Rush Hour\nTraffic volumes during morning rush hours (7-9 AM) have decreased by approximately 15% compared to pre-implementation baselines. This suggests that many commuters have either:\n- Shifted their travel times\n- Changed their mode of transportation\n- Opted for remote work arrangements\n\n### Alternative Routes\nWe''ve observed increased traffic on alternative routes that avoid the congestion pricing zone. The George Washington Bridge and tunnels from Queens have seen modest increases in traffic volume.\n\n### Public Transit Impact\nMTA reports indicate a 12% increase in subway ridership during peak hours, suggesting successful mode shift from personal vehicles to public transportation.\n\n## Implications\n\nThese early trends suggest that congestion pricing is achieving its intended goals of:\n1. Reducing traffic congestion in Manhattan\n2. Encouraging public transit use\n3. Improving air quality in congested areas\n\nWe will continue to monitor these trends and provide updates as more data becomes available.',
  'Traffic Research Team',
  ARRAY['Analysis', 'Week 1', 'Data'],
  true
),
(
  'Commuter Survey Results: How New Yorkers Are Adapting',
  'commuter-survey-results-adaptation',
  E'Our comprehensive survey of 2,542 regular NYC commuters provides valuable insights into behavioral changes following congestion pricing implementation.\n\n## Survey Methodology\n\nWe conducted this survey from January 8-12, 2025, targeting commuters who:\n- Travel into Manhattan at least 3 days per week\n- Previously drove personal vehicles\n- Work in the congestion pricing zone\n\n## Key Results\n\n### Mode Shift\n- 38% switched to public transit full-time\n- 22% now use park-and-ride facilities\n- 15% changed work schedules to avoid peak hours\n- 25% continue driving but express dissatisfaction\n\n### Cost Concerns\nThe most common concern cited by respondents was the cumulative cost of congestion fees. Many noted that while individual fees seem reasonable, monthly totals add up significantly.\n\n## Conclusion\n\nThe data suggests that New Yorkers are adapting more quickly than anticipated, with significant behavioral changes occurring in just the first week.',
  'Policy Analysis Team',
  ARRAY['Survey', 'Behavior', 'Adaptation'],
  true
),
(
  'Technical Deep Dive: Our Data Collection Methodology',
  'technical-methodology-data-collection',
  E'Our traffic monitoring system collects real-time data from multiple sources to provide accurate, comprehensive traffic analysis for NYC commuter routes.\n\n## Data Sources\n\n### Google Maps API\nWe query the Google Maps Directions API every 15 minutes for each of our monitored routes, collecting duration in traffic, distance, and alternative route suggestions.\n\n### MTA Real-Time Data\nFor public transit comparisons, we integrate subway arrival predictions, service alerts, and crowding information.\n\n## Data Validation\n\nWe implement multiple validation layers:\n1. Anomaly detection to flag outlier values\n2. Cross-referencing against historical patterns\n3. Source verification using multiple data sources\n\n## Storage and Analysis\n\nAll data is stored in Supabase PostgreSQL with automated backups, query optimization for time-series analysis, and real-time aggregation for dashboard displays.',
  'Data Engineering Team',
  ARRAY['Technical', 'Methodology', 'Data'],
  true
);
