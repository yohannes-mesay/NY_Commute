import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlogData";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  console.log("BlogPost Debug:", { slug, post, isLoading, error });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-900">
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-white text-xl">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-900">
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
            <p className="text-gray-400 mb-4">Error: {error?.toString()}</p>
            <Button onClick={() => navigate("/blog")} variant="outline" className="bg-slate-700 text-white hover:bg-slate-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-900">
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <Button
          onClick={() => navigate("/blog")}
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        <article className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-slate-700 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="text-gray-300 space-y-4">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-3xl font-bold text-white mb-4 mt-8" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />,
                h3: ({ ...props }) => <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
                p: ({ ...props }) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                li: ({ ...props }) => <li className="text-gray-300" {...props} />,
                a: ({ ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                code: ({ ...props }) => <code className="bg-slate-700 px-2 py-1 rounded text-sm text-gray-200" {...props} />,
                pre: ({ ...props }) => <pre className="bg-slate-700 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
