
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserList } from "@/components/admin/UserList";
import { UserProfile } from "@/services/authService";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const AdminPage = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (!data?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setIsAdmin(data.is_admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin permissions",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users and system settings
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <UserList />
        </TabsContent>
        <TabsContent value="statistics">
          <div className="rounded-md border bg-card p-6">
            <h3 className="text-lg font-medium">System Statistics</h3>
            <p className="text-muted-foreground">
              This feature will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="rounded-md border bg-card p-6">
            <h3 className="text-lg font-medium">System Settings</h3>
            <p className="text-muted-foreground">
              This feature will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
