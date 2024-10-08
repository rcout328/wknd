'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { supabase } from "@/lib/supabaseClient";
import validator from 'validator'; // Import the validator package

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginRegisterAdminPageComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true); // New loading state

  const isValidEmail = (email) => {
    return validator.isEmail(email) && email.endsWith('@gmail.com'); // Check for Gmail format
  };

  const isValidPassword = (password) => {
    // Check for minimum length and complexity
    return (
      password.length >= 8 &&
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    );
  };

  useEffect(() => {
    const checkUserStatus = () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        // Redirect to home or admin home based on stored email
        if (storedEmail === 'admin123@gmail.com') {
          window.location.href = '/admin-dashboard'; // Redirect to admin home
        } else {
          window.location.href = '/'; // Redirect to home
        }
      }
      setLoading(false); // Set loading to false after checking
    };

    checkUserStatus();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long and not a simple password like "12345".');
      return;
    }
    const { data, error } = await supabase
      .from('User')
      .select()
      .eq('emailid', email)
      .eq('password', password)
      .single()

    if (error) {
      console.error('Login error:', error.message)
      alert('Login failed. Please check your credentials.')
    } else if (data) {
      console.log('Logged in user:', data)
      localStorage.setItem('userEmail', data.emailid); // Store the email in local storage
      // Redirect based on user role
      if (data.emailid === 'admin123@gmail.com') {
        window.location.href = '/admin-dashboard'; // Redirect to admin home
      } else {
        window.location.href = '/'; // Redirect to home
      }
    } else {
      alert('Invalid email or password')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long and not a simple password like "12345".');
      return;
    }
    const { data, error } = await supabase
      .from('User')
      .insert([
        { emailid: email, password: password }
      ])

    if (error) {
      console.error('Registration error:', error.message)
      alert('Registration failed. Please try again.')
    } else {
      console.log('Registered user:', data)
      alert('Registration successful! Please log in.')
      // Clear the form fields
      setEmail('')
      setPassword('')
      setFullName('')
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    // Use the email and password state variables
    if (email === 'admin123@gmail.com' && password === '12345') {
      console.log('Admin logged in')
      localStorage.setItem('userEmail', email); // Store the email in local storage
      window.location.href = '/admin-dashboard'; // Redirect to admin home
    } else {
      alert('Invalid admin credentials')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="loader">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        {/* Responsive Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="text-pink-600 p-2 sm:p-3"
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Back</span>
            </Button>
          </Link>
        </div>
        
        <CardHeader className="space-y-1 pt-16 sm:pt-20">
          <CardTitle className="text-3xl font-bold text-center">WKND Cakes</CardTitle>
          <CardDescription className="text-center">Login, create an account, or access admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input id="email" placeholder="Enter your email" type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Link href="#" className="text-sm text-pink-500 hover:underline pl-1">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white">Log in</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-email"
                        placeholder="Enter your email"
                        type="email"
                        className="pl-10" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Create a password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the{" "}
                      <a href="#" className="text-pink-500 hover:underline">
                        terms and conditions
                      </a>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white">Create Account</Button>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-email"
                        placeholder="Enter admin email"
                        type="email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="admin-remember" />
                    <label
                      htmlFor="admin-remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remember me
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
    
      </Card>
    </div>
  );
}