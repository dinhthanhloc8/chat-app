package com.thanhloc.dto.response.message;

import com.thanhloc.constant.MessageAction;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RealtimeMessageResponse {
    MessageAction action;
    MessageDetailsResponse data;
}
