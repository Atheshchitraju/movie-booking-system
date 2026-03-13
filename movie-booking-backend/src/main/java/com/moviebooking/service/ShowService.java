package com.moviebooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moviebooking.dto.ShowRequest;
import com.moviebooking.entity.Movie;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.entity.Theater;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheaterRepository;

import jakarta.transaction.Transactional;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    public Show createShow(ShowRequest request) {

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        Show show = new Show();
        show.setMovie(movie);
        show.setTheater(theater);
        show.setShowTime(request.getShowTime());
        show.setPrice(request.getPrice());

        Show savedShow = showRepository.save(show);

        generateSeats(savedShow);

        return savedShow;
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
    }

    public List<Show> getShowsByMovie(Long movieId) {
        return showRepository.findByMovieId(movieId);
    }

    @Transactional
    public void deleteShow(Long id) {
        List<Seat> seats = seatRepository.findByShowId(id);
        if (seats != null && !seats.isEmpty()) {
            seatRepository.deleteAll(seats);
        }

        showRepository.deleteById(id);
    }

    private void generateSeats(Show savedShow) {
        String[] rows = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" };

        for (String row : rows) {
            for (int i = 1; i <= 10; i++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + i);
                seat.setBooked(false);
                seat.setShowId(savedShow.getId());
                seatRepository.save(seat);
            }
        }
    }
}