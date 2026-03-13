package com.moviebooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moviebooking.dto.ShowRequest;
import com.moviebooking.entity.Show;
import com.moviebooking.service.ShowService;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowController {

    @Autowired
    private ShowService showService;

    @PostMapping
    public Show createShow(@RequestBody ShowRequest request) {
        System.out.println("movieId = " + request.getMovieId());
        System.out.println("theaterId = " + request.getTheaterId());
        System.out.println("showTime = " + request.getShowTime());
        System.out.println("price = " + request.getPrice());

        return showService.createShow(request);
    }

    @GetMapping
    public List<Show> getAllShows() {
        return showService.getAllShows();
    }

    @GetMapping("/{id}")
    public Show getShowById(@PathVariable Long id) {
        return showService.getShowById(id);
    }

    @GetMapping("/movie/{movieId}")
    public List<Show> getShowsByMovie(@PathVariable Long movieId) {
        return showService.getShowsByMovie(movieId);
    }

    @DeleteMapping("/{id}")
    public String deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return "Show deleted successfully";
    }
}