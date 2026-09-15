package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.entity.RedZone;
import com.sih.hazardrelocation.repository.RedZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RedZoneService {

    private final RedZoneRepository repository;

    public RedZoneService(
            RedZoneRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<RedZone> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<RedZone> getActive() {
        return repository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public RedZone getById(UUID id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Red zone not found: " + id
                        )
                );
    }

    public RedZone create(RedZone redZone) {

        return repository.save(redZone);
    }

    public RedZone update(
            UUID id,
            RedZone updatedZone
    ) {

        RedZone existing = getById(id);

        existing.setName(updatedZone.getName());
        existing.setRiskLevel(
                updatedZone.getRiskLevel()
        );
        existing.setReason(
                updatedZone.getReason()
        );
        existing.setSource(
                updatedZone.getSource()
        );
        existing.setGeometry(
                updatedZone.getGeometry()
        );
        existing.setActive(
                updatedZone.getActive()
        );

        return repository.save(existing);
    }

    public void delete(UUID id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Red zone not found: " + id
            );
        }

        repository.deleteById(id);
    }
}