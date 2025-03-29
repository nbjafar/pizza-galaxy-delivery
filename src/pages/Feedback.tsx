
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { addFeedback, getPublishedFeedback } from '@/services/database';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const publishedFeedback = getPublishedFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message || rating === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit feedback to local database
    addFeedback({
      name,
      email,
      message,
      rating
    });
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setRating(0);
    setIsSubmitting(false);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-center bg-cover" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/feedback-hero.jpg")'
        }}>
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
            Share Your Feedback
          </h1>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
            We value your opinion! Let us know what you think about our pizzas and service
          </p>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-playfair text-pizza">Leave Your Feedback</h2>
              <p className="text-gray-600 mb-8">
                Your feedback helps us improve our pizzas and service. Please take a moment to share your thoughts with us.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name*</Label>
                  <Input 
                    id="name" 
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Your Email*</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="rating">Your Rating*</Label>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Your Feedback*</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us what you think about our pizza and service..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-40"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-pizza hover:bg-pizza-light w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 font-playfair text-pizza">What Others Say</h2>
              
              {publishedFeedback.length > 0 ? (
                <div className="space-y-6">
                  {publishedFeedback.map((feedback) => (
                    <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">"{feedback.message}"</p>
                      <div className="flex justify-between">
                        <p className="font-bold">{feedback.name}</p>
                        <p className="text-gray-500 text-sm">{feedback.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600">No feedback has been published yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Feedback Matters Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-playfair">Why Your Feedback Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-pizza-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pizza text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Improving Our Menu</h3>
              <p className="text-gray-600">
                Your feedback helps us refine our recipes and create new exciting menu items.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-pizza-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pizza text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Enhancing Service</h3>
              <p className="text-gray-600">
                We're committed to providing excellent service, and your comments help us get better.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-pizza-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pizza text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Building Community</h3>
              <p className="text-gray-600">
                Your feedback helps us create a better dining experience for our entire community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Feedback;
