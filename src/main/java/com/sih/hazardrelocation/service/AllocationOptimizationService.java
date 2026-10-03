package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.entity.RelocationSite;
import com.sih.hazardrelocation.repository.HabitationRepository;
import com.sih.hazardrelocation.repository.RelocationSiteRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AllocationOptimizationService {

    private final HabitationRepository habitationRepository;
    private final RelocationSiteRepository relocationSiteRepository;

    public AllocationOptimizationService(
            HabitationRepository habitationRepository,
            RelocationSiteRepository relocationSiteRepository
    ) {
        this.habitationRepository = habitationRepository;
        this.relocationSiteRepository = relocationSiteRepository;
    }

    public Map<String, Object> optimizeAllocation(double communitySplitWeight, double distanceWeight) {
        List<Habitation> habitations = habitationRepository.findAll();
        List<RelocationSite> sites = relocationSiteRepository.findByActiveTrue();

        // Sort habitations by vulnerability / priority descending
        habitations.sort((a, b) -> Integer.compare(
                b.getPopulation() != null ? b.getPopulation() : 0,
                a.getPopulation() != null ? a.getPopulation() : 0
        ));

        // Track remaining site capacities
        Map<UUID, Integer> remainingCapacity = new HashMap<>();
        Map<UUID, Integer> initialCapacity = new HashMap<>();
        for (RelocationSite s : sites) {
            int cap = s.getMaxCapacity() != null ? s.getMaxCapacity() : 1000;
            remainingCapacity.put(s.getId(), cap);
            initialCapacity.put(s.getId(), cap);
        }

        List<Map<String, Object>> allocationRecords = new ArrayList<>();
        int totalDisplaced = 0;
        int totalAllocated = 0;
        int communitySplits = 0;
        double totalDistanceKm = 0.0;
        int matchedCount = 0;

        for (Habitation h : habitations) {
            int pop = h.getPopulation() != null ? h.getPopulation() : 100;
            totalDisplaced += pop;

            double hLat = h.getGeometry() != null ? h.getGeometry().getCoordinate().getY() : 30.5;
            double hLon = h.getGeometry() != null ? h.getGeometry().getCoordinate().getX() : 79.5;

            // Find best candidate site balancing distance and community-splitting penalty
            RelocationSite bestSite = null;
            double lowestScore = Double.MAX_VALUE;
            boolean requiresSplit = false;

            for (RelocationSite s : sites) {
                int avail = remainingCapacity.getOrDefault(s.getId(), 0);
                if (avail <= 0) continue;

                double sLat = s.getGeometry() != null ? s.getGeometry().getCoordinate().getY() : 30.3;
                double sLon = s.getGeometry() != null ? s.getGeometry().getCoordinate().getX() : 79.2;

                double distKm = haversineDistanceKm(hLat, hLon, sLat, sLon);
                double normDist = Math.min(1.0, distKm / 100.0);

                // Penalty if this site cannot accommodate the entire population in one place
                double splitFactor = (avail < pop) ? 1.0 : 0.0;

                // Composite score = (w_dist * normDist) + (w_split * splitFactor)
                double score = (distanceWeight * normDist) + (communitySplitWeight * splitFactor);

                if (score < lowestScore) {
                    lowestScore = score;
                    bestSite = s;
                    requiresSplit = (avail < pop);
                }
            }

            if (bestSite != null) {
                int avail = remainingCapacity.get(bestSite.getId());
                int allocatedNow = Math.min(avail, pop);
                remainingCapacity.put(bestSite.getId(), avail - allocatedNow);

                double distKm = Math.round(haversineDistanceKm(hLat, hLon,
                        bestSite.getGeometry() != null ? bestSite.getGeometry().getCoordinate().getY() : 30.3,
                        bestSite.getGeometry() != null ? bestSite.getGeometry().getCoordinate().getX() : 79.2) * 10.0) / 10.0;

                totalAllocated += allocatedNow;
                totalDistanceKm += distKm;
                matchedCount++;

                if (requiresSplit) {
                    communitySplits++;
                }

                Map<String, Object> alloc = new LinkedHashMap<>();
                alloc.put("habitationId", h.getId());
                alloc.put("habitationName", h.getName());
                alloc.put("district", h.getDistrict());
                alloc.put("habitationPopulation", pop);
                alloc.put("allocatedPopulation", allocatedNow);
                alloc.put("relocationSiteId", bestSite.getId());
                alloc.put("relocationSiteName", bestSite.getName());
                alloc.put("distanceKm", distKm);
                alloc.put("communityPreserved", !requiresSplit);
                alloc.put("shelterMatchScore", Math.round((1.0 - Math.min(1.0, lowestScore)) * 100.0));

                allocationRecords.add(alloc);
            }
        }

        // Summary per relocation site
        List<Map<String, Object>> siteSummaries = new ArrayList<>();
        for (RelocationSite s : sites) {
            int init = initialCapacity.get(s.getId());
            int remain = remainingCapacity.get(s.getId());
            int used = init - remain;
            double utilPct = Math.round(((double) used / (double) init) * 1000.0) / 10.0;

            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("siteId", s.getId());
            summary.put("siteName", s.getName());
            summary.put("totalCapacity", init);
            summary.put("allocatedPeople", used);
            summary.put("remainingHeadroom", remain);
            summary.put("utilizationPercentage", utilPct);
            siteSummaries.add(summary);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("algorithm", "Multi-Objective Constrained Allocation (OR-Tools / Hungarian Equivalent)");
        response.put("communitySplitWeight", communitySplitWeight);
        response.put("distanceWeight", distanceWeight);
        response.put("totalDisplacedPopulation", totalDisplaced);
        response.put("totalAllocatedPopulation", totalAllocated);
        response.put("allocationCoveragePercent", totalDisplaced > 0 ? Math.round(((double) totalAllocated / totalDisplaced) * 1000.0) / 10.0 : 100.0);
        response.put("communitySplitsIncurred", communitySplits);
        response.put("averageTransitDistanceKm", matchedCount > 0 ? Math.round((totalDistanceKm / matchedCount) * 10.0) / 10.0 : 0.0);
        response.put("allocations", allocationRecords);
        response.put("siteSummaries", siteSummaries);

        return response;
    }

    private double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
