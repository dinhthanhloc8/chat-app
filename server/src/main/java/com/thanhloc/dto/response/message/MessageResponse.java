package com.thanhloc.dto.response.message;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thanhloc.dto.response.file.FileResponse;
import com.thanhloc.dto.response.user.UserProfileResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse implements Serializable {
    String id;
    String content;
    boolean active;
    long seq;
    String type;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;
    UserProfileResponse user;
    FileResponse file;
}