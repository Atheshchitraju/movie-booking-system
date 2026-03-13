package com.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.moviebooking.entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {

}