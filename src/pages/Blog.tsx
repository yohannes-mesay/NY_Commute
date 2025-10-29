
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight, TrendingUp, AlertTriangle, FileText } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const blogPosts = [
    {
      id: 1,
      title: "First Week Analysis: Traffic Patterns Show Early Changes",
      summary: "Initial data from the first week of congestion pricing reveals interesting patterns in commuter behavior and traffic flow across NYC bridges and tunnels.",
      content: "Detailed analysis of the immediate impacts...",
      date: "January 12, 2025",
      author: "Traffic Research Team",
      tags: ["Analysis", "Week 1", "Data"],
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Commuter Survey Results: How New Yorkers Are Adapting",
      summary: "Results from our survey of 2,500+ commuters reveal how people are changing their travel patterns in response to congestion pricing.",
      content: "Survey methodology and key findings...",
      date: "January 10, 2025",
      author: "Policy Analysis Team",
      tags: ["Survey", "Behavior", "Adaptation"],
      readTime: "7 min read",
      featured: false
    },
    {
      id: 3,
      title: "Technical Deep Dive: Our Data Collection Methodology",
      summary: "Behind the scenes look at how we collect, validate, and analyze traffic data across six major commuter routes into NYC.",
      content: "Technical explanation of our systems...",
      date: "January 8, 2025",
      author: "Data Engineering Team",
      tags: ["Technical", "Methodology", "Data"],
      readTime: "12 min read",
      featured: false
    },
    {
      id: 4,
      title: "Press Coverage Roundup: Media Response to Implementation",
      summary: "Compilation of major news coverage and editorial opinions about NYC's congestion pricing launch from local and national outlets.",
      content: "Media analysis and coverage summary...",
      date: "January 6, 2025",
      author: "Communications Team",
      tags: ["Media", "Press", "Coverage"],
      readTime: "4 min read",
      featured: false
    },
    {
      id: 5,
      title: "Pre-Implementation Baseline: What Normal Traffic Looked Like",
      summary: "Comprehensive analysis of traffic patterns from October-December 2024, establishing baseline measurements for comparison.",
      content: "Historical data analysis...",
      date: "December 30, 2024",
      author: "Research Team",
      tags: ["Baseline", "Historical", "Analysis"],
      readTime: "8 min read",
      featured: false
    }
  ];

  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'analysis': return TrendingUp;
      case 'technical': return FileText;
      case 'survey': case 'behavior': return User;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Traffic Analysis Blog
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            In-depth analysis, research findings, and insights about NYC congestion pricing and its impact on commuter traffic patterns.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              All Posts
            </Button>
            {allTags.map(tag => {
              const Icon = getTagIcon(tag);
              return (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className="bg-slate-700 hover:bg-slate-600 border-slate-600"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedTag === null && searchTerm === "" && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600 hover:bg-blue-700">Featured</Badge>
                <Badge variant="outline" className="border-slate-600 text-gray-400">
                  {featuredPost.readTime}
                </Badge>
              </div>
              <CardTitle className="text-2xl text-white hover:text-blue-400 transition-colors cursor-pointer">
                {featuredPost.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                {featuredPost.summary}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                </div>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                {featuredPost.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map(post => (
            <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-slate-600 text-gray-400">
                    {post.readTime}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {post.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author.split(' ')[0]}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700 text-gray-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found matching your search criteria.</p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedTag(null);
              }}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
