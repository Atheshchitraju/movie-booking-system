package com.moviebooking.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.entity.Booking;
import com.moviebooking.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
	
	private Long showId;
	
    private List<Long> seatIds;
    
    private String userEmail;
    
    private String paymentId;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/lock")
    public Booking lockSeats(@RequestBody Map<String, Object> request) {
        Long showId = Long.valueOf(request.get("showId").toString());

        @SuppressWarnings("unchecked")
        List<Object> seatIdsRaw = (List<Object>) request.get("seatIds");
        List<Long> seatIds = seatIdsRaw.stream()
                .map(id -> Long.valueOf(id.toString()))
                .collect(Collectors.toList());

        String userEmail = request.get("userEmail").toString();

        return bookingService.lockSeats(showId, seatIds, userEmail);
    }

    @PostMapping("/confirm")
    public Booking confirmBooking(@RequestBody Map<String, Object> request) {
        Long showId = Long.valueOf(request.get("showId").toString());

        @SuppressWarnings("unchecked")
        List<Object> seatIdsRaw = (List<Object>) request.get("seatIds");
        List<Long> seatIds = seatIdsRaw.stream()
                .map(id -> Long.valueOf(id.toString()))
                .collect(Collectors.toList());

        String userEmail = request.get("userEmail").toString();
        String paymentId = request.get("paymentId") != null
                ? request.get("paymentId").toString()
                : "PAY-" + System.currentTimeMillis();

        return bookingService.confirmBooking(showId, seatIds, userEmail, paymentId);
    }

    @GetMapping("/user/{email}")
    public List<Booking> getBookingsByUserEmail(@PathVariable String email) {
        return bookingService.getBookingsByUserEmail(email);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }
}