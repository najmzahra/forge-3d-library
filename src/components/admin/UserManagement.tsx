import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_creator: boolean;
  created_at: string;
  user_id: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCreatorStatus = async (userId: string, isCreator: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: !isCreator })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User creator status updated successfully`,
      });

      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <p className="text-muted-foreground">
          Manage users, their roles, and creator permissions.
        </p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {user.full_name || user.username || 'Unknown User'}
                    </h3>
                    {user.username && user.full_name && (
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={user.is_creator ? "default" : "secondary"}>
                    {user.is_creator ? "Creator" : "User"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCreatorStatus(user.id, user.is_creator)}
                  >
                    {user.is_creator ? (
                      <>
                        <Shield className="w-4 h-4 mr-1" />
                        Remove Creator
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Make Creator
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No users found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};