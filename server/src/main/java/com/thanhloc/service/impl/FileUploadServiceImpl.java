package com.thanhloc.service.impl;

import com.thanhloc.dto.FileUploadDto;
import com.thanhloc.entity.ConversationEntity;
import com.thanhloc.entity.FileUploadEntity;
import com.thanhloc.entity.UserEntity;
import com.thanhloc.mapper.FileUploadMapper;
import com.thanhloc.repository.FileUploadRepository;
import com.thanhloc.service.CloudinaryService;
import com.thanhloc.service.FileUploadService;
import com.thanhloc.util.FileUploadUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class FileUploadServiceImpl implements FileUploadService {
    CloudinaryService cloudinaryService;
    FileUploadRepository fileUploadRepository;
    FileUploadMapper fileUploadMapper;
    FileUploadUtil fileUploadUtil;

    @Override
    public FileUploadDto uploadFileMessage(MultipartFile file) throws IOException {
        // check size
        fileUploadUtil.checkSize(file);

        // upload on cloudinary
        return cloudinaryService.uploadMessageFile(file);
    }

    @Override
    public FileUploadEntity uploadAvatar(MultipartFile file) throws IOException {
        // check size
        fileUploadUtil.checkSize(file);

        // check if file is image
        fileUploadUtil.checkIsImage(file);

        // upload on cloudinary
        FileUploadDto uploadedFileDto = cloudinaryService.uploadAvatar(file);
        FileUploadEntity newFileUpload = fileUploadMapper.toFileUploadEntity(uploadedFileDto);

        // persist upload file
        return fileUploadRepository.save(newFileUpload);
    }

    @Override
    public UserEntity uploadUserAvatar(UserEntity user, MultipartFile avatar) throws Exception {
        FileUploadEntity uploadedFile = this.uploadAvatar(avatar);

        user.setAvatar(uploadedFile);
        return user;
    }

    @Override
    public ConversationEntity uploadConversationAvatar(ConversationEntity conversation, MultipartFile avatar) throws Exception {
        FileUploadEntity uploadedFile = this.uploadAvatar(avatar);
        conversation.setAvatar(uploadedFile);
        return conversation;
    }


    @Override
    public void deleteFile(FileUploadEntity file) throws Exception {
        cloudinaryService.delete(file.getPublicId());
        fileUploadRepository.delete(file);
    }
}
