
package com.assetdesk.service;

import com.assetdesk.dto.*;
import com.assetdesk.exception.*;
import com.assetdesk.model.*;
import com.assetdesk.repository.AssetRepository;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetService {

    private final AssetRepository repository;

    public AssetService(AssetRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Asset add(AssetRequest request) {
        Asset asset = validatedAsset(request);

        if (repository.existsBySerialNumberIgnoreCase(
                asset.getSerialNumber())) {
            duplicate();
        }

        return repository.save(asset);
    }

    @Transactional(readOnly = true)
    public Asset findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new AssetNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public AssetPageResponse findAll(
            int page, int size, String q,
            String type, String condition, String status) {

        if (page < 0 || size < 1 || size > 100) {
            throw new AssetValidationException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid pagination.",
                    Map.of());
        }

        List<Asset> assets = getAllAssets();

        if (type != null && !type.isBlank()) {
            AssetType value = enumOrError(
                    AssetType.class, type, "type");
            assets.removeIf(a -> a.getType() != value);
        }

        if (condition != null && !condition.isBlank()) {
            AssetCondition value = enumOrError(
                    AssetCondition.class, condition, "condition");
            assets.removeIf(a -> a.getCondition() != value);
        }

        if (status != null && !status.isBlank()) {
            AssetStatus value = enumOrError(
                    AssetStatus.class, status, "status");
            assets.removeIf(a -> a.getStatus() != value);
        }

        if (q != null && !q.isBlank()) {
            String search = q.trim().toLowerCase(Locale.ROOT);

            assets.removeIf(a ->
                    !a.getDeviceName().toLowerCase(Locale.ROOT)
                            .contains(search)
                    && !a.getSerialNumber().toLowerCase(Locale.ROOT)
                            .contains(search)
                    && !a.getAssignedTo().toLowerCase(Locale.ROOT)
                            .contains(search));
        }

        long totalElements = assets.size();
        int totalPages = (int) Math.ceil(
                (double) totalElements / size);

        long start = (long) page * size;
        int from = (int) Math.min(start, totalElements);
        int to = (int) Math.min(start + size, totalElements);

        List<Asset> content = assets.subList(from, to);

        return new AssetPageResponse(
                content, page, size, totalElements, totalPages);
    }

    @Transactional
    public Asset update(Long id, AssetRequest request) {
        Asset existing = findById(id);
        Asset value = validatedAsset(request);

        if (repository.existsBySerialNumberIgnoreCaseAndIdNot(
                value.getSerialNumber(), id)) {
            duplicate();
        }

        existing.setDeviceName(value.getDeviceName());
        existing.setType(value.getType());
        existing.setSerialNumber(value.getSerialNumber());
        existing.setAssignedTo(value.getAssignedTo());
        existing.setCondition(value.getCondition());
        existing.setPurchaseDate(value.getPurchaseDate());
        existing.setStatus(value.getStatus());

        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public AssetStats stats() {
        List<Asset> assets = getAllAssets();
        Map<String, Long> byType = new LinkedHashMap<>();

        for (AssetType type : AssetType.values()) {
            long count = assets.stream()
                    .filter(a -> a.getType() == type)
                    .count();

            byType.put(type.name(), count);
        }

        long available = assets.stream()
                .filter(a -> a.getStatus() == AssetStatus.AVAILABLE)
                .count();

        long assigned = assets.stream()
                .filter(a -> a.getStatus() == AssetStatus.ASSIGNED)
                .count();

        long inRepair = assets.stream()
                .filter(a -> a.getStatus() == AssetStatus.IN_REPAIR)
                .count();

        List<Asset> needsAttention = assets.stream()
                .filter(a ->
                        a.getStatus() == AssetStatus.IN_REPAIR
                        || a.getCondition() == AssetCondition.FAIR
                        || a.getCondition() == AssetCondition.DAMAGED)
                .toList();

        return new AssetStats(
                assets.size(), available, assigned,
                inRepair, byType, needsAttention);
    }

    private List<Asset> getAllAssets() {
        return StreamSupport.stream(
                repository.findAll().spliterator(), false)
                .sorted(Comparator.comparing(Asset::getId))
                .collect(java.util.stream.Collectors.toCollection(
                        ArrayList::new));
    }

    private Asset validatedAsset(AssetRequest req) {
        if (req == null) {
            throw new AssetValidationException(
                    HttpStatus.BAD_REQUEST,
                    "Validation failed.",
                    Map.of());
        }

        Map<String, String> errors = new LinkedHashMap<>();

        String name = trim(req.deviceName());
        String serial = trim(req.serialNumber());
        String assigned = trim(req.assignedTo());

        if (name.isEmpty()) {
            errors.put("deviceName", "Device name is required.");
        }

        if (serial.isEmpty()) {
            errors.put("serialNumber", "Serial number is required.");
        }

        AssetType type = validateEnum(
                AssetType.class, req.type(), "type",
                "Choose a valid type.", errors);

        AssetCondition condition = validateEnum(
                AssetCondition.class, req.condition(), "condition",
                "Choose a valid condition.", errors);

        AssetStatus status = validateEnum(
                AssetStatus.class, req.status(), "status",
                "Choose a valid status.", errors);

        LocalDate date = null;

        if (trim(req.purchaseDate()).isEmpty()) {
            errors.put("purchaseDate", "Pick a purchase date.");
        } else {
            try {
                date = LocalDate.parse(req.purchaseDate().trim());
            } catch (DateTimeParseException ex) {
                errors.put("purchaseDate", "Enter a valid date.");
            }
        }

        if (status == AssetStatus.ASSIGNED && assigned.isEmpty()) {
            errors.put(
                    "assignedTo",
                    "Enter who this asset is assigned to.");
        }

        if (!errors.isEmpty()) {
            throw new AssetValidationException(
                    HttpStatus.BAD_REQUEST,
                    "Validation failed.",
                    errors);
        }

        Asset asset = new Asset();
        asset.setDeviceName(name);
        asset.setType(type);
        asset.setSerialNumber(serial);
        asset.setAssignedTo(assigned);
        asset.setCondition(condition);
        asset.setPurchaseDate(date);
        asset.setStatus(status);

        return asset;
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static <T extends Enum<T>> T validateEnum(
            Class<T> cls, String value, String key,
            String message, Map<String, String> errors) {

        try {
            return Enum.valueOf(cls, trim(value));
        } catch (IllegalArgumentException ex) {
            errors.put(key, message);
            return null;
        }
    }

    private static <T extends Enum<T>> T enumOrError(
            Class<T> cls, String value, String key) {

        try {
            return Enum.valueOf(cls, value);
        } catch (IllegalArgumentException ex) {
            throw new AssetValidationException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid filter.",
                    Map.of(key, "Invalid value."));
        }
    }

    private static void duplicate() {
        String message =
                "An asset with this serial number already exists.";

        throw new AssetValidationException(
                HttpStatus.CONFLICT,
                message,
                Map.of("serialNumber", message));
    }
}
