package com.thanhloc.exception;

import com.thanhloc.constant.ExceptionCode;

import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults (level = AccessLevel.PRIVATE)
public class AppException extends RuntimeException{
    String code;
    HttpStatusCode httpCode;

    public AppException (String message, ExceptionCode exceptionCode){
        super(message);
        this.code = exceptionCode.getCode();
        this.httpCode = exceptionCode.getHttpCode();
    }
}
