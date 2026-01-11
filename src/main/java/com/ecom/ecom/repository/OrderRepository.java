package com.ecom.ecom.repository;

import com.ecom.ecom.entity.Order;
import com.ecom.ecom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
