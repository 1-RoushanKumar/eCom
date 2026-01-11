package com.ecom.ecom.repository;

import com.ecom.ecom.entity.Cart;
import com.ecom.ecom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
