package com.moviebooking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviebooking.entity.Booking;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.UserRepository;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Service
public class BookingService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Booking> getBookingsByUserEmail(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking bookSeats(Long showId, List<Long> seatIds, String userEmail) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> seats = seatRepository.findAllById(seatIds);

        if (seats.size() != seatIds.size()) {
            throw new RuntimeException("Some seats not found");
        }

        for (Seat seat : seats) {
            if (seat.isBooked()) {
                throw new RuntimeException("Seat already booked: " + seat.getSeatNumber());
            }
        }

        for (Seat seat : seats) {
            seat.setBooked(true);
            seat.setLockTime(null);
        }

        seatRepository.saveAll(seats);

        Booking booking = new Booking();
        booking.setShow(show);
        booking.setUserEmail(userEmail);
        booking.setBookingTime(LocalDateTime.now());
        booking.setPaymentStatus("SUCCESS");
        booking.setSeatsBooked(
                seats.stream()
                        .map(Seat::getSeatNumber)
                        .collect(Collectors.joining(","))
        );
        booking.setTotalAmount(seats.size() * show.getPrice());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking lockSeats(Long showId, List<Long> seatIds, String email) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> seats = seatRepository.findAllById(seatIds);

        if (seats.size() != seatIds.size()) {
            throw new RuntimeException("Some seats not found");
        }

        LocalDateTime now = LocalDateTime.now();

        for (Seat seat : seats) {

            if (seat.isBooked()) {
                throw new RuntimeException("Seat already booked: " + seat.getSeatNumber());
            }

            if (seat.getLockTime() != null &&
                seat.getLockTime().isAfter(now.minusMinutes(5))) {
                throw new RuntimeException("Seat locked by another user: " + seat.getSeatNumber());
            }
        }

        for (Seat seat : seats) {
            seat.setLockTime(now);
        }

        seatRepository.saveAll(seats);

        Booking booking = new Booking();
        booking.setShow(show);
        booking.setUserEmail(email);
        booking.setPaymentStatus("PENDING");
        booking.setBookingTime(now);
        booking.setSeatsBooked(
                seats.stream()
                        .map(Seat::getSeatNumber)
                        .collect(Collectors.joining(","))
        );
        booking.setTotalAmount(seats.size() * show.getPrice());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking processDummyPayment(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getPaymentStatus())) {
            throw new RuntimeException("Payment already processed");
        }

        List<Seat> seats = seatRepository.findByShowId(booking.getShow().getId());

        for (Seat seat : seats) {
            if (booking.getSeatsBooked().contains(seat.getSeatNumber())) {
                seat.setBooked(true);
                seat.setLockTime(null);
            }
        }

        seatRepository.saveAll(seats);

        booking.setPaymentStatus("SUCCESS");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmPayment(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus("SUCCESS");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking finalizePayment(Long bookingId, String paymentId, String orderId, String signature) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getPaymentStatus())) {
            throw new RuntimeException("Payment already processed");
        }

        try {
            Map<String, String> params = Map.of(
                    "razorpay_order_id", orderId,
                    "razorpay_payment_id", paymentId,
                    "razorpay_signature", signature
            );

            JSONObject json = new JSONObject(params);
            Utils.verifyPaymentSignature(json, "YOUR_RAZORPAY_SECRET");

        } catch (RazorpayException e) {
            throw new RuntimeException("Payment verification failed", e);
        }

        List<Seat> seats = seatRepository.findByShowId(booking.getShow().getId());

        for (Seat seat : seats) {
            if (booking.getSeatsBooked().contains(seat.getSeatNumber())) {
                seat.setBooked(true);
                seat.setLockTime(null);
            }
        }

        seatRepository.saveAll(seats);

        booking.setPaymentStatus("SUCCESS");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmBooking(Long showId, List<Long> seatIds, String userEmail, String paymentId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> seats = seatRepository.findAllById(seatIds);

        if (seats.size() != seatIds.size()) {
            throw new RuntimeException("Some seats not found");
        }

        for (Seat seat : seats) {
            if (seat.isBooked()) {
                throw new RuntimeException("Seat already booked: " + seat.getSeatNumber());
            }
        }

        for (Seat seat : seats) {
            seat.setBooked(true);
            seat.setLockTime(null);
        }

        seatRepository.saveAll(seats);

        Booking booking = new Booking();
        booking.setShow(show);
        booking.setUserEmail(userEmail);
        booking.setBookingTime(LocalDateTime.now());
        booking.setPaymentStatus("SUCCESS");
        booking.setPaymentId(paymentId);
        booking.setSeatsBooked(
                seats.stream()
                        .map(Seat::getSeatNumber)
                        .collect(Collectors.joining(","))
        );
        booking.setTotalAmount(seats.size() * show.getPrice());

        return bookingRepository.save(booking);
    }
    
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}