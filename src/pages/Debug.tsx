
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { checkApiHealth, getDiagnosticInfo } from '@/services/api';
import { toast } from 'sonner';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Debug = () => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [apiUrl, setApiUrl] = useState<string>(import.meta.env.VITE_API_URL || 'Not configured');
  const [networkRequests, setNetworkRequests] = useState<{url: string, status: number, method: string}[]>([]);
  const [offlineMode, setOfflineMode] = useState<string>(import.meta.env.VITE_OFFLINE_MODE || 'auto');
  
  useEffect(() => {
    checkServerStatus();
  }, []);
  
  const checkServerStatus = async () => {
    try {
      const result = await checkApiHealth();
      setHealthStatus(result.ok ? 'online' : 'offline');
      
      if (result.ok) {
        fetchDiagnosticInfo();
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      setHealthStatus('offline');
      toast.error('Failed to check server status');
    }
  };
  
  const fetchDiagnosticInfo = async () => {
    try {
      const info = await getDiagnosticInfo();
      setDiagnosticInfo(info);
    } catch (error) {
      console.error('Error fetching diagnostic info:', error);
      toast.error('Failed to fetch diagnostic information');
    }
  };
  
  // Track recent requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        console.log(`Debug: Request ${config.method?.toUpperCase()} to ${config.url}`);
        return config;
      },
      error => Promise.reject(error)
    );
    
    const responseInterceptor = axios.interceptors.response.use(
      response => {
        setNetworkRequests(prev => [
          { 
            url: response.config.url || '', 
            status: response.status,
            method: response.config.method?.toUpperCase() || 'UNKNOWN'
          },
          ...prev.slice(0, 9)
        ]);
        return response;
      },
      error => {
        if (error.response) {
          setNetworkRequests(prev => [
            { 
              url: error.config.url || '', 
              status: error.response.status,
              method: error.config.method?.toUpperCase() || 'UNKNOWN' 
            },
            ...prev.slice(0, 9)
          ]);
        } else {
          setNetworkRequests(prev => [
            { 
              url: error.config?.url || 'Network Error', 
              status: 0,
              method: error.config?.method?.toUpperCase() || 'UNKNOWN' 
            },
            ...prev.slice(0, 9)
          ]);
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
        
        {healthStatus === 'offline' && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Offline Mode Active</AlertTitle>
            <AlertDescription>
              The app is currently running in offline mode with fallback data. API connection failed.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>API Connection Status</CardTitle>
              <CardDescription>Check if the application can connect to the backend API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>API URL:</strong> {apiUrl}</p>
              <p className="mb-4">
                <strong>Status:</strong>{' '}
                {healthStatus === 'checking' ? (
                  <span className="text-gray-500">Checking...</span>
                ) : healthStatus === 'online' ? (
                  <span className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="h-4 w-4" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-amber-500">
                    <Info className="h-4 w-4" /> Offline (using fallback data)
                  </span>
                )}
              </p>
              {healthStatus === 'offline' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm mb-4">
                  <p className="font-semibold">Connection Error</p>
                  <p>Make sure:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>The server is running at {apiUrl}</li>
                    <li>CORS is properly configured</li>
                    <li>No network issues are preventing communication</li>
                  </ul>
                  <p className="mt-2">The application is using built-in fallback data for demonstration purposes.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <Button onClick={checkServerStatus}>Recheck Connection</Button>
              
              <div className="flex items-center space-x-2">
                <Switch id="offline-mode" disabled />
                <Label htmlFor="offline-mode">Force Offline Mode (Coming soon)</Label>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Current configuration settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
                <p><strong>VITE_DEBUG:</strong> {import.meta.env.VITE_DEBUG || 'Not set'}</p>
                <p><strong>VITE_API_TIMEOUT:</strong> {import.meta.env.VITE_API_TIMEOUT || 'Not set'}</p>
                <p><strong>VITE_OFFLINE_MODE:</strong> {import.meta.env.VITE_OFFLINE_MODE || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Network Requests</CardTitle>
            <CardDescription>Last 10 API calls made by the application</CardDescription>
          </CardHeader>
          <CardContent>
            {networkRequests.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {networkRequests.map((request, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{request.method}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.url}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.status === 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                              Failed
                            </span>
                          ) : request.status >= 200 && request.status < 300 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {request.status}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {request.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No requests recorded yet</p>
            )}
          </CardContent>
        </Card>
        
        {diagnosticInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Server Diagnostic Information</CardTitle>
              <CardDescription>Details about the server environment and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(diagnosticInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Development Notes</CardTitle>
            <CardDescription>Information for developers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">About Offline Mode</h3>
                <p className="text-gray-600 text-sm">
                  This application includes built-in fallback data so it can be demonstrated without a running API server.
                  All API functions will gracefully fall back to demo data when the server is unreachable.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">API Server Setup</h3>
                <p className="text-gray-600 text-sm">
                  To connect to a real API server:
                </p>
                <ul className="list-disc ml-5 text-gray-600 text-sm mt-1">
                  <li>Start the server from the <code>server</code> folder</li>
                  <li>Make sure the VITE_API_URL environment variable points to your server</li>
                  <li>Default server URL is <code>http://localhost:5000/api</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Debug;
