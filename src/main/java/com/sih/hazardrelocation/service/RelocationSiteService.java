package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.relocation.RelocationSiteRequest;
import com.sih.hazardrelocation.dto.relocation.RelocationSiteResponse;
import com.sih.hazardrelocation.entity.RelocationSite;
import com.sih.hazardrelocation.mapper.RelocationMapper;
import com.sih.hazardrelocation.repository.RelocationSiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RelocationSiteService {

    private final RelocationSiteRepository repository;
    private final RelocationMapper mapper;

    public RelocationSiteService(
            RelocationSiteRepository repository,
            RelocationMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<RelocationSiteResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RelocationSiteResponse> getActiveSites() {

        return repository.findByActiveTrue()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RelocationSiteResponse getById(UUID id) {

        RelocationSite site =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relocation site not found: "
                                                + id
                                )
                        );

        return mapper.toResponse(site);
    }

    public RelocationSiteResponse create(
            RelocationSiteRequest request
    ) {

        RelocationSite site =
                mapper.toEntity(request);

        return mapper.toResponse(
                repository.save(site)
        );
    }

    public RelocationSiteResponse update(
            UUID id,
            RelocationSiteRequest request
    ) {

        RelocationSite site =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relocation site not found: "
                                                + id
                                )
                        );

        mapper.updateEntity(site, request);

        return mapper.toResponse(
                repository.save(site)
        );
    }

    public void delete(UUID id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Relocation site not found: " + id
            );
        }

        repository.deleteById(id);
    }
}