package com.assetdesk.dto;

// Input model: String fields enable frontend-compatible field-by-field validation errors.
public record AssetRequest(String deviceName, String type, String serialNumber, String assignedTo, String condition,
		String purchaseDate, String status) {
}
