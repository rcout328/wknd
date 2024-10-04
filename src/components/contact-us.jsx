'use client'

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import Footer from './Footer';

export function ContactUsComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12">Get in Touch</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Your Name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Your message here..."
                      rows={4} />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0" />
                    <p className="text-gray-600">123 Cake Street, Dessert City, 12345</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-pink-500 mr-3" />
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-pink-500 mr-3" />
                    <p className="text-gray-600">info@wkndcakes.com</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sat-Sun: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Find Us</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844797932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1616562308246!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{border:0}}
                    allowFullScreen={true}
                    loading="lazy"></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}