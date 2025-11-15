import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogData";
import { format } from "date-fns";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { data: blogPosts, isLoading } = useBlogPosts(true);

  if (isLoading) {
    return (
      <div className="relative min-h-screen pt-24 pb-16">
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
          <div className="text-center text-white">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  const allTags = [...new Set((blogPosts || []).flatMap(post => post.tags))];
  
  const filteredPosts = (blogPosts || []).filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Traffic Analysis Blog
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            In-depth analysis, research findings, and insights about NYC congestion pricing and its impact on commuter traffic patterns.
          </p>
        </div>

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
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
            >
              All Posts
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-sm sm:text-base"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Card 
              key={post.id} 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white group-hover:text-blue-400 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {post.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.created_at), "MMM d, yyyy")}
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
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm w-full">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
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
