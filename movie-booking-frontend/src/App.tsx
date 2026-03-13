import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import UserBookings from "./pages/UserBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageMovies from "./pages/admin/ManageMovies";
import ManageTheatres from "./pages/admin/ManageTheatres";
import ManageShows from "./pages/admin/ManageShows";
import AdminBookings from "./pages/admin/AdminBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/seats/:showId" element={
              <ProtectedRoute><SeatSelection /></ProtectedRoute>
            } />
            <Route path="/booking/:bookingId" element={
              <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute><UserBookings /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/movies" replace />} />
              <Route path="movies" element={<ManageMovies />} />
              <Route path="theatres" element={<ManageTheatres />} />
              <Route path="shows" element={<ManageShows />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
