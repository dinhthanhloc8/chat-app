package com.thanhloc.util.impl;

import com.thanhloc.dto.ConversationDto;
import com.thanhloc.dto.MemberDto;
import com.thanhloc.entity.ConversationEntity;
import com.thanhloc.entity.ParticipantEntity;
import com.thanhloc.entity.UserEntity;
import com.thanhloc.mapper.ConversationMapper;
import com.thanhloc.mapper.UserMapper;
import com.thanhloc.repository.CustomizedConversationRepository;
import com.thanhloc.repository.ParticipantRepository;
import com.thanhloc.util.ConversationUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class ConversationUtilImpl implements ConversationUtil {
    final UserMapper userMapper;
    final private ParticipantRepository participantRepository;
    final private CustomizedConversationRepository customizedConversationRepository;
    final private ConversationMapper conversationMapper;

    @Override
    public boolean isAdminOfConversation(UserEntity userEntity, ConversationEntity conversation) {
        return conversation.getCreatedBy().equals(userEntity);
    }

    @Override
    public List<ConversationEntity> getSingleConversationsOfUser(UserEntity user) {
        List<ParticipantEntity> participants = participantRepository.findByUser(user);
        List<ConversationEntity> conversations = participants.stream().map(ParticipantEntity::getConversation).toList();
        return conversations.stream().filter(e -> !e.isGroup()).toList();
    }

    @Override
    public Optional<ConversationEntity> getSingleConversation(UserEntity firstUser, UserEntity secondUser) {

        List<ConversationEntity> singleConversationsOfFirstUser = getSingleConversationsOfUser(firstUser);
        List<ConversationEntity> singleConversationsOfSecondUser = getSingleConversationsOfUser(secondUser);

        return singleConversationsOfFirstUser.stream().filter(singleConversationsOfSecondUser::contains).findFirst();
    }

    @Override
    public Set<UserEntity> getMembersOfConversation(ConversationEntity conversation) {
        Set<ParticipantEntity> participantsOfConversation = participantRepository.findByConversation(conversation);

        List<UserEntity> membersOfConversation  = participantsOfConversation.stream().map(ParticipantEntity::getUser).toList();

        return new HashSet<>(membersOfConversation);
    }

    @Override
    public Set<MemberDto> getMemberDtoListOfConversation(ConversationEntity conversation) {
        Set<ParticipantEntity> participantsOfConversation = participantRepository.findByConversation(conversation);
        List<MemberDto> membersOfConversation  = participantsOfConversation.stream().map(e ->{
            MemberDto memberDto = userMapper.toMemberDto(e.getUser());
            memberDto.setLastRead(e.getLastRead());

            return memberDto;
        }).toList();

        return new HashSet<>(membersOfConversation);
    }

    @Override
    public Page<ConversationDto> getConversationsOfUser(UserEntity user, Pageable pageable) {
        List<ConversationEntity> conversations =  customizedConversationRepository.getAllConversationsByUserId(user.getId(), pageable);

        List<ConversationDto> conversationDtoList = conversations.stream().map(conversation -> {
            Set<MemberDto> members = getMemberDtoListOfConversation(conversation);
            ConversationDto conversationDto = conversationMapper.toConversationDto(conversation);
            if (conversationDto != null) conversationDto.setMembers(members);

            return conversationDto;
        }).toList();

        long total = customizedConversationRepository.getTotalConversationsByUserId(user.getId());

        return new PageImpl<>(conversationDtoList, pageable, total);
    };
}
