package com.thanhloc.service;

import com.thanhloc.dto.request.conversation.AddMemberToConversationRequest;
import com.thanhloc.dto.request.conversation.ConversationAvatarChangeRequest;
import com.thanhloc.dto.request.conversation.ConversationCreationRequest;
import com.thanhloc.dto.request.conversation.RemoveFromConversationRequest;
import com.thanhloc.dto.request.conversation.RenameConversationRequest;
import com.thanhloc.dto.response.PageResponse;
import com.thanhloc.dto.response.conversation.ConversationAvatarChangeResponse;
import com.thanhloc.dto.response.conversation.ConversationDetailsResponse;
import com.thanhloc.dto.response.conversation.RenameConversationResponse;

import org.springframework.stereotype.Service;

@Service
public interface ConversationService {
    ConversationDetailsResponse createConversation (String userEmail, ConversationCreationRequest conversationCreationRequest);

    ConversationDetailsResponse getConversationById (String userEmail, String conversationId);

    ConversationDetailsResponse getSingleConversationByUser(String yourEmail, String restUserId);

    PageResponse<ConversationDetailsResponse> getAllConversationsOfUser(String userEmail, int page, int pageSize);

    ConversationDetailsResponse addMemberToConversation(String adminEmail, AddMemberToConversationRequest addMemberToConversationRequest);

    RenameConversationResponse renameConversation(String adminEmail, RenameConversationRequest renameConversationRequest);

    ConversationAvatarChangeResponse changeAvatarConversation(String adminEmail, ConversationAvatarChangeRequest changeAvatarRequest) throws Exception;

    void removeAvatarConversation(String adminEmail, String conversationId) throws Exception;

    boolean removeFromConversation(String userEmail, RemoveFromConversationRequest request);

    boolean deleteConversation(String userEmail, String conversationId);
}
