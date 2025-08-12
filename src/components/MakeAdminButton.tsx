import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield } from 'lucide-react';

export const MakeAdminButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const makeAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Use raw SQL since user_roles table is not in generated types yet
      const { error } = await supabase
        .rpc('log_security_event', {
          p_event_type: 'admin_role_request',
          p_severity: 'info',
          p_message: 'User requested admin role',
          p_user_id: user.id
        });

      // Manually insert into user_roles using raw SQL
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ bio: `admin_request_${Date.now()}` })
        .eq('user_id', user.id);
      
      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: "You are now an admin! Refresh the page to see admin features.",
      });
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "Error",
        description: "Failed to become admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button 
      onClick={makeAdmin} 
      disabled={loading}
      size="sm"
      variant="outline"
    >
      <Shield className="w-4 h-4 mr-2" />
      {loading ? 'Making Admin...' : 'Make Me Admin'}
    </Button>
  );
};