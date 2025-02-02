'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      } else {
        const { url } = await response.json()

        router.push(url)
      }

      // If the response is a redirect, the browser will handle it
      toast({
        title: 'Login Initiated',
        description: 'Redirecting to authentication...',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login to InstaBlue</h1>
        <p className="text-muted-foreground">Enter your handle to continue</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="handle">Handle</Label>
          <Input
            id="handle"
            type="text"
            placeholder="Enter your handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}