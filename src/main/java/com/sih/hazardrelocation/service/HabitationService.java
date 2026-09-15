package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.habitation.HabitationRequest;
import com.sih.hazardrelocation.dto.habitation.HabitationResponse;
import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.mapper.HabitationMapper;
import com.sih.hazardrelocation.repository.HabitationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class HabitationService {

    private final HabitationRepository habitationRepository;
    private final HabitationMapper habitationMapper;

    public HabitationService(
            HabitationRepository habitationRepository,
            HabitationMapper habitationMapper
    ) {
        this.habitationRepository = habitationRepository;
        this.habitationMapper = habitationMapper;
    }

    @Transactional(readOnly = true)
    public List<HabitationResponse> getAll() {

        return habitationRepository.findAll()
                .stream()
                .map(habitationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HabitationResponse getById(UUID id) {

        Habitation habitation = habitationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Habitation not found: " + id
                        )
                );

        return habitationMapper.toResponse(habitation);
    }

    public HabitationResponse create(HabitationRequest request) {

        Habitation habitation =
                habitationMapper.toEntity(request);

        Habitation saved =
                habitationRepository.save(habitation);

        return habitationMapper.toResponse(saved);
    }

    public HabitationResponse update(
            UUID id,
            HabitationRequest request
    ) {

        Habitation habitation =
                habitationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Habitation not found: " + id
                                )
                        );

        habitationMapper.updateEntity(
                habitation,
                request
        );

        Habitation updated =
                habitationRepository.save(habitation);

        return habitationMapper.toResponse(updated);
    }

    public void delete(UUID id) {

        if (!habitationRepository.existsById(id)) {
            throw new RuntimeException(
                    "Habitation not found: " + id
            );
        }

        habitationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<HabitationResponse> getByDistrict(
            String district
    ) {

        return habitationRepository
                .findByDistrictIgnoreCase(district)
                .stream()
                .map(habitationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HabitationResponse> getByState(
            String state
    ) {

        return habitationRepository
                .findByStateIgnoreCase(state)
                .stream()
                .map(habitationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HabitationResponse> getHighlyVulnerable(
            Double minimumScore
    ) {

        return habitationRepository
                .findByVulnerabilityScoreGreaterThanEqual(
                        minimumScore
                )
                .stream()
                .map(habitationMapper::toResponse)
                .toList();
    }
}