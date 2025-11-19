package com.thanhloc.service;

public interface WebSocketService {
    void sendUpdateUserStatus(String email, boolean online);
}
