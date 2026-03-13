import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Auth
export const registerUser = (data: { name: string; email: string; password: string; role: string }) =>
  API.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

// Movies
export const getMovies = () => API.get("/movies");
export const getMovie = (id: string) => API.get(`/movies/${id}`);
export const createMovie = (data: any) => API.post("/movies", data);
export const updateMovie = (id: string, data: any) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id: string) => API.delete(`/movies/${id}`);

// Shows
export const getShowsByMovie = (movieId: string) => API.get(`/shows/movie/${movieId}`);
export const getShows = () => API.get("/shows");
export const createShow = (data: any) => API.post("/shows", data);
export const updateShow = (id: string, data: any) => API.put(`/shows/${id}`, data);
export const deleteShow = (id: string) => API.delete(`/shows/${id}`);

// Theatres
export const getTheatres = () => API.get("/theaters");
export const createTheatre = (data: any) => API.post("/theaters", data);
export const updateTheatre = (id: string, data: any) => API.put(`/theaters/${id}`, data);
export const deleteTheatre = (id: string) => API.delete(`/theaters/${id}`);

// Seats
export const getSeatsByShow = (showId: string) => API.get(`/seats/show/${showId}`);

// Bookings
export const lockSeats = (data: { showId: string; seatIds: string[]; userEmail: string }) =>
  API.post("/bookings/lock", data);

export const confirmBooking = (data: { showId: string; seatIds: string[]; userEmail: string; paymentId: string }) =>
  API.post("/bookings/confirm", data);

export const getUserBookings = (email: string) => API.get(`/bookings/user/${email}`);
export const getBookingById = (id: string) => API.get(`/bookings/${id}`);
export const getAllBookings = () => API.get("/bookings");

export default API;
