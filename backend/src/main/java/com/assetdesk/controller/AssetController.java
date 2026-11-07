
package com.assetdesk.controller;

import com.assetdesk.dto.*;
import com.assetdesk.model.Asset;
import com.assetdesk.service.AssetService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService service;

    public AssetController(AssetService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Asset add(@RequestBody AssetRequest request) {
        return service.add(request);
    }

    @GetMapping("/{id}")
    public Asset findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    public AssetPageResponse findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String status) {

        return service.findAll(
                page, size, q, type, condition, status);
    }

    @PutMapping("/{id}")
    public Asset update(
            @PathVariable Long id,
            @RequestBody AssetRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/stats")
    public AssetStats stats() {
        return service.stats();
    }
}
