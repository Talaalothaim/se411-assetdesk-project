
package com.assetdesk.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("assets")
public class Asset {

	@Id
	private Long id;

	@Column("device_name")
	private String deviceName;

	private AssetType type;

	@Column("serial_number")
	private String serialNumber;

	@Column("assigned_to")
	private String assignedTo;

	private AssetCondition condition;

	@Column("purchase_date")
	private LocalDate purchaseDate;

	private AssetStatus status;

	public Asset() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public AssetType getType() {
		return type;
	}

	public void setType(AssetType type) {
		this.type = type;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public String getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(String assignedTo) {
		this.assignedTo = assignedTo;
	}

	public AssetCondition getCondition() {
		return condition;
	}

	public void setCondition(AssetCondition condition) {
		this.condition = condition;
	}

	public LocalDate getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(LocalDate purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

	public AssetStatus getStatus() {
		return status;
	}

	public void setStatus(AssetStatus status) {
		this.status = status;
	}
}
