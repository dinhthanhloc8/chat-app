package com.thanhloc.repository;

import com.thanhloc.entity.ConversationEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, String> {}
