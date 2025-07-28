import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Upload, 
  Settings, 
  Bell,
  User,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

import { useAuth } from '@/hooks/stores/useAuth';
import { useCart } from '@/hooks/stores/useCart';
import { useUpload } from '@/hooks/stores/useUpload';
import { useApp } from '@/hooks/stores/useApp';

export const ZustandDemo = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  
  // Auth store
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading,
    login, 
    logout 
  } = useAuth();

  // Cart store
  const { 
    items, 
    total, 
    itemCount, 
    addToCart, 
    removeItem, 
    updateQuantity,
    clearCart,
    getFormattedTotal 
  } = useCart();

  // Upload store
  const { 
    files, 
    projects, 
    uploadFile,
    createProject 
  } = useUpload();

  // App store
  const { 
    notifications,
    unreadCount,
    preferences,
    notifySuccess,
    notifyError,
    notifyInfo,
    toggleTheme,
    updatePreference,
    clearNotifications,
    isDarkMode,
    isLightMode,
    isSystemTheme
  } = useApp();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      notifySuccess('Logged in successfully', 'Welcome back!');
    } catch (error) {
      notifyError('Login failed', 'Please check your credentials');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      notifyInfo('Logged out', 'See you soon!');
    } catch (error) {
      notifyError('Logout failed', 'Please try again');
    }
  };

  const mockProject = {
    id: 'demo-project',
    title: 'Industrial Gear Assembly',
    description: 'High-quality 3D model of industrial gear mechanism',
    thumbnail: '/placeholder.svg',
    images: ['/placeholder.svg'],
    price: 29.99,
    format: 'STEP, OBJ, STL',
    fileSize: '15.2 MB',
    category: 'mechanical',
    author: {
      id: 'author1',
      name: 'Engineering Pro',
      avatar: '/placeholder.svg'
    },
    downloads: 1250,
    likes: 89,
    featured: false,
    tags: ['gear', 'mechanical', 'industrial'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: []
  };

  const handleAddToCart = () => {
    addToCart(mockProject);
    notifySuccess('Added to cart', `${mockProject.title} added to cart`);
  };

  const handleTestUpload = () => {
    const mockFile = new File(['test'], 'test-model.step', { type: 'application/step' });
    uploadFile(mockFile);
    notifyInfo('Upload started', 'File upload simulation in progress');
  };

  const handleCreateProject = () => {
    createProject({
      title: `Demo Project ${Date.now()}`,
      description: 'Test project created from Zustand demo',
      category: 'mechanical',
      tags: ['demo', 'test'],
      price: 19.99,
      files: [],
      status: 'draft'
    });
    notifySuccess('Project created', 'New project added to your uploads');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Zustand State Management Demo</h1>
        <p className="text-muted-foreground">
          Step 2 Complete: Advanced state management with Zustand stores
        </p>
      </div>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="app">App State</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Authentication Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800">Logged in as:</h3>
                    <p className="text-green-700">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-green-600">@{user?.username} ({user?.role})</p>
                  </div>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Try: admin@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Try: admin123"
                    />
                  </div>
                  <Button onClick={handleLogin} disabled={authLoading}>
                    {authLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart Store
                <Badge variant="secondary">{itemCount} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleAddToCart}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Demo Item
                </Button>
                <Button onClick={clearCart} variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-muted-foreground">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total: {getFormattedTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Store
                <Badge variant="secondary">{files.length} files</Badge>
                <Badge variant="secondary">{projects.length} projects</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleTestUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Simulate Upload
                </Button>
                <Button onClick={handleCreateProject} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Files:</h4>
                  {files.slice(-3).map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Badge variant={
                        file.status === 'completed' ? 'default' :
                        file.status === 'uploading' ? 'secondary' :
                        file.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {file.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                App State Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="space-y-2">
                <Label>Theme Preferences</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isLightMode ? 'default' : 'outline'}
                    onClick={() => updatePreference('theme', 'light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    size="sm"
                    variant={isDarkMode ? 'default' : 'outline'}
                    onClick={() => updatePreference('theme', 'dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant={isSystemTheme ? 'default' : 'outline'}
                    onClick={() => updatePreference('theme', 'system')}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Notifications</Label>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => notifySuccess('Test', 'Success message')}>
                    Success
                  </Button>
                  <Button size="sm" onClick={() => notifyError('Test', 'Error message')}>
                    Error
                  </Button>
                  <Button size="sm" onClick={() => notifyInfo('Test', 'Info message')}>
                    Info
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearNotifications}>
                    Clear All
                  </Button>
                </div>
                
                {notifications.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {notifications.slice(0, 3).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 text-sm rounded ${
                          notif.type === 'success' ? 'bg-green-50 text-green-800' :
                          notif.type === 'error' ? 'bg-red-50 text-red-800' :
                          'bg-blue-50 text-blue-800'
                        }`}
                      >
                        <div className="font-medium">{notif.title}</div>
                        {notif.message && (
                          <div className="text-xs opacity-75">{notif.message}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
