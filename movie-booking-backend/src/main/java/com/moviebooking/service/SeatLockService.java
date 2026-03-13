package com.moviebooking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviebooking.entity.Seat;
import com.moviebooking.repository.SeatRepository;

@Service
public class SeatLockService {

    private final SeatRepository seatRepository;

    public SeatLockService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredLocks() {

        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(2);

        List<Seat> expiredSeats = seatRepository.findByLockTimeBefore(expiryTime);

        for (Seat seat : expiredSeats) {
            seat.setBooked(false);
            seat.setLockTime(null);
        }

        seatRepository.saveAll(expiredSeats);

        System.out.println("Expired seat locks released");
    }
}