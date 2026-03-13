//package com.moviebooking.service;
//
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import com.moviebooking.dto.LoginRequest;
//import com.moviebooking.dto.RegisterRequest;
//import com.moviebooking.entity.User;
//import com.moviebooking.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public String register(RegisterRequest request) {
//
//        User user = User.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(User.Role.valueOf(request.getRole()))
//                .build();
//
//        userRepository.save(user);
//
//        return "User registered successfully";
//    }
//
//    public String login(LoginRequest request) {
//
//        User user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
//            throw new RuntimeException("Invalid password");
//        }
//
//        return "Login successful";
//    }
//}

package com.moviebooking.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moviebooking.entity.Role;
import com.moviebooking.entity.User;
import com.moviebooking.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register User
    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    // Login User
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}