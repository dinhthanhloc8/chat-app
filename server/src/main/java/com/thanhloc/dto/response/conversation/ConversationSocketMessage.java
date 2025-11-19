package com.thanhloc.dto.response.conversation;

import com.thanhloc.constant.ConversationAction;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ConversationSocketMessage {
    ConversationAction action;
    ConversationDetailsResponse data;
}
