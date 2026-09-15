package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.hazard.HazardEventRequest;
import com.sih.hazardrelocation.dto.hazard.HazardEventResponse;
import com.sih.hazardrelocation.entity.HazardEvent;
import com.sih.hazardrelocation.mapper.HazardEventMapper;
import com.sih.hazardrelocation.repository.HazardEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class HazardService {

    private final HazardEventRepository hazardEventRepository;
    private final HazardEventMapper hazardEventMapper;

    public HazardService(
            HazardEventRepository hazardEventRepository,
            HazardEventMapper hazardEventMapper
    ) {
        this.hazardEventRepository = hazardEventRepository;
        this.hazardEventMapper = hazardEventMapper;
    }

    @Transactional(readOnly = true)
    public List<HazardEventResponse> getAll() {

        return hazardEventRepository.findAll()
                .stream()
                .map(hazardEventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HazardEventResponse getById(UUID id) {

        HazardEvent hazardEvent =
                hazardEventRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hazard event not found: " + id
                                )
                        );

        return hazardEventMapper.toResponse(hazardEvent);
    }

    public HazardEventResponse create(
            HazardEventRequest request
    ) {

        HazardEvent hazardEvent =
                hazardEventMapper.toEntity(request);

        HazardEvent saved =
                hazardEventRepository.save(hazardEvent);

        return hazardEventMapper.toResponse(saved);
    }

    public HazardEventResponse update(
            UUID id,
            HazardEventRequest request
    ) {

        HazardEvent hazardEvent =
                hazardEventRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hazard event not found: " + id
                                )
                        );

        hazardEvent.setHazardType(request.getHazardType());
        hazardEvent.setSeverity(request.getSeverity());
        hazardEvent.setEventDate(request.getEventDate());
        hazardEvent.setSource(request.getSource());
        hazardEvent.setDescription(request.getDescription());

        if (request.getLatitude() != null
                && request.getLongitude() != null) {

            hazardEvent =
                    hazardEventMapper.toEntity(request);

            hazardEvent.setId(id);
        }

        HazardEvent updated =
                hazardEventRepository.save(hazardEvent);

        return hazardEventMapper.toResponse(updated);
    }

    public void delete(UUID id) {

        if (!hazardEventRepository.existsById(id)) {
            throw new RuntimeException(
                    "Hazard event not found: " + id
            );
        }

        hazardEventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<HazardEventResponse> getByType(
            String hazardType
    ) {

        return hazardEventRepository
                .findByHazardTypeIgnoreCase(hazardType)
                .stream()
                .map(hazardEventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HazardEventResponse> getByDateRange(
            LocalDate start,
            LocalDate end
    ) {

        return hazardEventRepository
                .findByEventDateBetween(start, end)
                .stream()
                .map(hazardEventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HazardEventResponse> getSevereHazards(
            Double minimumSeverity
    ) {

        return hazardEventRepository
                .findBySeverityGreaterThanEqual(
                        minimumSeverity
                )
                .stream()
                .map(hazardEventMapper::toResponse)
                .toList();
    }
}