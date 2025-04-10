import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { LocationProvider } from './contexts/LocationContext';
import { FiltersProvider } from './contexts/FiltersContext';
import ErrorBoundary from './components/ErrorBoundary';
import { queryClient } from './lib/react-query';
import Index from "./pages/Index";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import RestaurantsPage from './pages/RestaurantsPage';
import PlanPage from './pages/PlanPage';
import SavedPage from './pages/SavedPage';
import ApiTestPage from './pages/ApiTestPage';
import AIAssistant from "./pages/AIAssistant";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <NextUIProvider>
          <TooltipProvider>
            <LocationProvider>
              <FiltersProvider>
                <AuthProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/index" element={<Index />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/restaurants" element={<RestaurantsPage />} />
                      <Route path="/plan" element={<PlanPage />} />
                      <Route path="/saved" element={<SavedPage />} />
                      <Route path="/ai-assistant" element={<AIAssistant />} />
                      <Route path="/api-test" element={<ApiTestPage />} />
                    </Routes>
                  </BrowserRouter>
                </AuthProvider>
                <Toaster />
                <Sonner />
              </FiltersProvider>
            </LocationProvider>
          </TooltipProvider>
        </NextUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;