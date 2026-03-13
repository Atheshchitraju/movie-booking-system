package com.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.entity.Theater;
import com.moviebooking.repository.TheaterRepository;

@RestController
@RequestMapping("/api/theaters")
@CrossOrigin(origins = "http://localhost:5173")
public class TheaterController {

    private final TheaterRepository theaterRepository;

    public TheaterController(TheaterRepository theaterRepository) {
        this.theaterRepository = theaterRepository;
    }

    // ✅ Add Theater
    @PostMapping
    public Theater addTheater(@RequestBody Theater theater) {
        return theaterRepository.save(theater);
    }

    // ✅ Get All Theaters
    @GetMapping
    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }

    // ✅ Get Theater By ID
    @GetMapping("/{id}")
    public Theater getTheaterById(@PathVariable Long id) {
        return theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
    }

    // ✅ Update Theater
    @PutMapping("/{id}")
    public Theater updateTheater(@PathVariable Long id, @RequestBody Theater updatedTheater) {

        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        theater.setName(updatedTheater.getName());
        theater.setLocation(updatedTheater.getLocation());

        return theaterRepository.save(theater);
    }

    // ✅ Delete Theater
    @DeleteMapping("/{id}")
    public String deleteTheater(@PathVariable Long id) {

        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        theaterRepository.delete(theater);
        return "Theater deleted successfully!";
    }
}