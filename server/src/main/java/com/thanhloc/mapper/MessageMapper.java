package com.thanhloc.mapper;

import com.thanhloc.dto.response.message.MessageDetailsResponse;
import com.thanhloc.dto.response.message.MessageResponse;
import com.thanhloc.entity.MessageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "user.avatar", source = "user.avatar.url")
    MessageDetailsResponse toMessageDetailsResponse(MessageEntity messageEntity);

    @Mapping(target = "user.avatar", source = "user.avatar.url")
    MessageResponse toMessageResponse (MessageEntity messageEntity);
    List<MessageResponse> toMessageResponseList(List<MessageEntity> messageEntities);
}
