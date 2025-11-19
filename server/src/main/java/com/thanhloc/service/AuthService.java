package com.thanhloc.service;

import java.io.UnsupportedEncodingException;

import jakarta.mail.MessagingException;

import com.thanhloc.dto.request.auth.LogInRequest;
import com.thanhloc.dto.request.auth.ResetPasswordRequest;
import com.thanhloc.dto.request.auth.SignUpRequest;
import com.thanhloc.dto.response.auth.LogInResponse;
import com.thanhloc.dto.response.auth.RefreshResponse;
import com.thanhloc.dto.response.auth.SignUpResponse;
import com.thanhloc.dto.response.auth.VerifyResponse;

public interface AuthService {
    SignUpResponse signUp (SignUpRequest signUpRequest) throws MessagingException, UnsupportedEncodingException;

    LogInResponse logIn (LogInRequest logInRequest);

    RefreshResponse refresh (String accessToken, String refreshToken);

    void logOut (String accessToken, String refreshToken);

    VerifyResponse verifyEmail(String verifyToken);

    String sendVerificationEmail(String email) throws MessagingException, UnsupportedEncodingException;

    String forgotPassword(String email) throws MessagingException, UnsupportedEncodingException;

    String confirmResetPassword(String resetToken);

    String resetPassword(String resetToken, ResetPasswordRequest request);
}
