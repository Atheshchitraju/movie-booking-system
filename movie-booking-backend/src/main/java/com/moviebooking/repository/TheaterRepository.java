package com.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.moviebooking.entity.Theater;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
}