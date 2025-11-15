import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

// You can change this key or set it as an environment variable
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "transit-admin-2025";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin key is stored in sessionStorage
    const storedKey = sessionStorage.getItem("admin_access");
    if (storedKey === ADMIN_KEY) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminKey === ADMIN_KEY) {
      sessionStorage.setItem("admin_access", adminKey);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin key. Access denied.");
      setAdminKey("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_access");
    setIsAuthenticated(false);
    navigate("/blog");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600/20 rounded-full">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Admin Access Required</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the admin key to manage blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Access Admin Panel
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-gray-400 hover:text-white"
                onClick={() => navigate("/blog")}
              >
                Back to Blog
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {children}
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminAuth;
