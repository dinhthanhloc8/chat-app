package com.thanhloc.dto.response.message;

import com.thanhloc.dto.MemberDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class LastReadMessageResponse {
    private String id;
    private MemberDto reader;
}
