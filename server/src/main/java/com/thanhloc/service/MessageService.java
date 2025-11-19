package com.thanhloc.service;

import java.io.IOException;

import com.thanhloc.dto.request.message.MessageRequest;
import com.thanhloc.dto.response.PageResponse;
import com.thanhloc.dto.response.message.LastReadMessageResponse;
import com.thanhloc.dto.response.message.MessageDetailsResponse;
import com.thanhloc.dto.response.message.MessageResponse;

public interface MessageService {
    MessageDetailsResponse sendMessage(String userEmail, MessageRequest messageRequest) throws IOException;

    PageResponse<MessageResponse> getAllMessagesOfConversation(String userEmail, String conversationId, int page, int pageSize);

    MessageDetailsResponse getMessageById(String userEmail,String id);

    MessageResponse getLastMessageOfConversation(String userEmail, String conversationId);

    MessageDetailsResponse deleteMessage(String userEmail, String id) throws Exception;

    LastReadMessageResponse readLastMessageOfConversation(String userEmail, String lastMessageId) throws Exception;
}
