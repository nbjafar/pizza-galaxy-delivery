
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { checkApiHealth, getDiagnosticInfo } from '@/services/api';
import { toast } from 'sonner';
import axios from 'axios';

const Debug = () => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [apiUrl, setApiUrl] = useState<string>(import.meta.env.VITE_API_URL || 'Not configured');
  const [networkRequests, setNetworkRequests] = useState<{url: string, status: number, method: string}[]>([]);
  
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
                  <span className="text-green-500">Online</span>
                ) : (
                  <span className="text-red-500">Offline</span>
                )}
              </p>
              {healthStatus === 'offline' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
                  <p className="font-semibold">Connection Error</p>
                  <p>Make sure:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>The server is running at {apiUrl}</li>
                    <li>CORS is properly configured</li>
                    <li>No network issues are preventing communication</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={checkServerStatus}>Recheck Connection</Button>
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
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
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
      </div>
    </MainLayout>
  );
};

export default Debug;
