
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  getFeedback, 
  updateFeedbackPublication, 
  deleteFeedback 
} from '@/services/database';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Star, 
  Calendar, 
  Trash
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const FeedbackAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);
  
  const feedback = getFeedback();
  
  // Filter feedback based on search query and publication status
  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'published' && item.isPublished) || 
      (filter === 'unpublished' && !item.isPublished);
    
    return matchesSearch && matchesFilter;
  });
  
  const handleTogglePublication = (id: number, isPublished: boolean) => {
    updateFeedbackPublication(id, isPublished);
  };
  
  const handleDeleteClick = (id: number) => {
    setFeedbackToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (feedbackToDelete !== null) {
      deleteFeedback(feedbackToDelete);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Customer Feedback</h1>
          <p className="text-gray-500 mt-2">
            Manage and respond to customer feedback
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'unpublished')}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="all">All Feedback</option>
            <option value="published">Published Only</option>
            <option value="unpublished">Unpublished Only</option>
          </select>
        </div>
        
        {/* Feedback Grid */}
        {filteredFeedback.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className={item.isPublished ? 'border-green-300' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{item.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleTogglePublication(item.id, !item.isPublished)}
                        >
                          {item.isPublished ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              <span>Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Publish</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-2">"{item.message}"</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{item.createdAt}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 justify-between">
                  <p className="text-sm text-gray-500">{item.email}</p>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.isPublished}
                      onCheckedChange={(checked) => handleTogglePublication(item.id, checked)}
                      aria-label="Toggle publication"
                    />
                    <span className="text-sm">
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No feedback found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this feedback? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FeedbackAdmin;
