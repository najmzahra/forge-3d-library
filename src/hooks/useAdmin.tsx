import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if current user is admin by querying user_roles table
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Query the user_roles table to check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) throw error;
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  // Fetch admin dashboard stats
  const fetchStats = async () => {
    if (!isAdmin) return;

    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total projects count
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Get pending approvals count (projects that need approval)
      const { count: pendingApprovals } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('revenue_tracking')
        .select('gross_amount')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.gross_amount || 0), 0) || 0;

      // Get monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyRevenueData } = await supabase
        .from('revenue_tracking')
        .select('gross_amount')
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyRevenue = monthlyRevenueData?.reduce((sum, item) => sum + (item.gross_amount || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        pendingApprovals: pendingApprovals || 0,
        totalRevenue: totalRevenue / 100, // Convert from cents
        monthlyRevenue: monthlyRevenue / 100 // Convert from cents
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin statistics",
        variant: "destructive"
      });
    }
  };

  // Approve/reject project
  const updateProjectApproval = async (projectId: string, approved: boolean, notes?: string) => {
    if (!isAdmin) return false;

    try {
      // For now, just update the is_published status as approval
      const { error } = await supabase
        .from('projects')
        .update({
          is_published: approved
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Project ${approved ? 'approved' : 'rejected'} successfully`,
      });

      await fetchStats(); // Refresh stats
      return true;
    } catch (error) {
      console.error('Error updating project approval:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isAdmin,
    loading,
    stats,
    fetchStats,
    updateProjectApproval
  };
};