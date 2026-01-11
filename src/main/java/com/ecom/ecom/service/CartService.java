package com.ecom.ecom.service;

import com.ecom.ecom.entity.Cart;
import com.ecom.ecom.entity.CartItem;
import com.ecom.ecom.entity.Product;
import com.ecom.ecom.entity.User;
import com.ecom.ecom.repository.CartRepository;
import com.ecom.ecom.repository.ProductRepository;
import com.ecom.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart addToCart(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if stock is sufficient before adding to cart (optional, but good practice)
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        // Get or Create Cart
        Cart cart = cartRepository.findByUser(user).orElse(new Cart());
        if (cart.getUser() == null) {
            cart.setUser(user);
        }

        // Check if item exists in cart, update quantity, else add new
        var existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Cart is empty"));
    }

    @Transactional
    public void removeFromCart(String userEmail, Long cartItemId) {
        Cart cart = getCart(userEmail);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        cartRepository.save(cart);
    }
}