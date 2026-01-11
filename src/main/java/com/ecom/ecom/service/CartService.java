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

import java.util.Optional;

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

        // Get or Create Cart
        Cart cart = cartRepository.findByUser(user).orElse(new Cart());
        if (cart.getUser() == null) {
            cart.setUser(user);
        }

        // Find if item already exists in cart
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // --- FIXED LOGIC STARTS HERE ---

        // 1. Calculate how many are ALREADY in the cart
        int currentQuantityInCart = existingItemOpt.map(CartItem::getQuantity).orElse(0);

        // 2. Validate: (Existing + New) vs Stock
        if (currentQuantityInCart + quantity > product.getStockQuantity()) {
            throw new RuntimeException("Insufficient stock. You already have "
                                       + currentQuantityInCart + " in your cart. Only "
                                       + product.getStockQuantity() + " available.");
        }
        // --- FIXED LOGIC ENDS HERE ---

        if (existingItemOpt.isPresent()) {
            existingItemOpt.get().setQuantity(currentQuantityInCart + quantity);
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