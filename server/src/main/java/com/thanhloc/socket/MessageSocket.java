package com.thanhloc.socket;

import com.thanhloc.constant.ConversationAction;
import com.thanhloc.constant.MessageAction;
import com.thanhloc.dto.response.conversation.ConversationDetailsResponse;
import com.thanhloc.dto.response.conversation.ConversationSocketMessage;
import com.thanhloc.dto.response.message.LastReadMessageResponse;
import com.thanhloc.dto.response.message.MessageDetailsResponse;
import com.thanhloc.dto.response.message.RealtimeMessageResponse;
import com.thanhloc.service.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Controller
public class MessageSocket {
     SimpMessagingTemplate simpMessagingTemplate;
     ConversationService conversationService;

     @MessageMapping ("/message")
     public void sendMessage(@Payload MessageDetailsResponse request) {
          simpMessagingTemplate.convertAndSend("/topic/conversation/messages/" + request.getConversation().getId(),
                  new RealtimeMessageResponse(MessageAction.SEND, request));

          ConversationDetailsResponse foundConversation = conversationService.getConversationById(request.getUser().getEmail(), request.getConversation().getId());
          ConversationSocketMessage message = ConversationSocketMessage.builder()
                  .data(foundConversation)
                  .action(ConversationAction.ADD)
                  .build();
          foundConversation.getMembers().forEach((e) -> simpMessagingTemplate.convertAndSend("/topic/conversation/list/" + e.getId(), message));
     }

     @MessageMapping ("/message/delete")
     public void deleteMessage(@Payload MessageDetailsResponse request) {
          simpMessagingTemplate.convertAndSend("/topic/conversation/messages/" + request.getConversation().getId(),
                  new RealtimeMessageResponse(MessageAction.DELETE, request));
          simpMessagingTemplate.convertAndSend("/topic/message/last/" + request.getConversation().getId(), request);
     }

     @MessageMapping ("/message/last-read")
     public void deleteMessage(@Payload LastReadMessageResponse request) {
          simpMessagingTemplate.convertAndSend("/topic/last-message/" + request.getId(), request);
     }
}
