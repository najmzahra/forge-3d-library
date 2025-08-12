import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RevenueData {
  totalRevenue: number;
  platformFees: number;
  creatorEarnings: number;
  transactionCount: number;
  averageOrderValue: number;
}

export const RevenueAnalytics = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      // Get all completed revenue tracking
      const { data: revenueData, error } = await supabase
        .from('revenue_tracking')
        .select('*')
        .eq('status', 'completed');

      if (error) throw error;

      const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.gross_amount || 0), 0) || 0;
      const platformFees = revenueData?.reduce((sum, item) => sum + (item.platform_fee || 0), 0) || 0;
      const creatorEarnings = revenueData?.reduce((sum, item) => sum + (item.net_amount || 0), 0) || 0;
      const transactionCount = revenueData?.length || 0;
      const averageOrderValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;

      setData({
        totalRevenue: totalRevenue / 100, // Convert from cents
        platformFees: platformFees / 100,
        creatorEarnings: creatorEarnings / 100,
        transactionCount,
        averageOrderValue: averageOrderValue / 100
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${(data?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Platform Fees',
      value: `$${(data?.platformFees || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Creator Earnings',
      value: `$${(data?.creatorEarnings || 0).toFixed(2)}`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Transactions',
      value: data?.transactionCount || 0,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2>
        <p className="text-muted-foreground">
          Track marketplace revenue, platform fees, and creator earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold">${(data?.totalRevenue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Fees (10%)</span>
                <span className="font-semibold">${(data?.platformFees || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Creator Earnings (90%)</span>
                <span className="font-semibold">${(data?.creatorEarnings || 0).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Order Value</span>
                <span className="font-semibold">${(data?.averageOrderValue || 0).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{data?.transactionCount || 0}</div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">
                  {data?.platformFees && data?.totalRevenue 
                    ? ((data.platformFees / data.totalRevenue) * 100).toFixed(1) 
                    : '0.0'}%
                </div>
                <p className="text-sm text-muted-foreground">Platform Fee Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};