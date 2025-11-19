package com.thanhloc.mapper;

import com.thanhloc.dto.FileUploadDto;
import com.thanhloc.entity.FileUploadEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FileUploadMapper {
    FileUploadEntity toFileUploadEntity(FileUploadDto fileUpload);
}
