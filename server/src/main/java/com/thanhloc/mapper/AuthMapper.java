package com.thanhloc.mapper;

import com.thanhloc.dto.request.auth.SignUpRequest;
import com.thanhloc.dto.response.auth.LogInResponse;
import com.thanhloc.dto.response.auth.SignUpResponse;
import com.thanhloc.entity.UserEntity;

import org.mapstruct.Mapper;

@Mapper (componentModel = "spring")
public interface AuthMapper {
    UserEntity toUserEntity (SignUpRequest signUpRequest);
    SignUpResponse toSignUpResponse (UserEntity userEntity);
    LogInResponse toLogInResponse (UserEntity userEntity);
}
