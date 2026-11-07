package com.assetdesk.service;

import com.assetdesk.dto.AssetRequest;
import com.assetdesk.exception.AssetNotFoundException;
import com.assetdesk.model.Asset;
import com.assetdesk.repository.AssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {
	@Mock
	AssetRepository repository;
	AssetService service;
	AssetRequest valid = new AssetRequest("Dell Latitude", "LAPTOP", "SER-1", "", "GOOD", "2025-02-14", "AVAILABLE");

	@BeforeEach
	void setup() {
		service = new AssetService(repository);
	}

	@Test
	void addSavesValidAsset() {
		when(repository.save(any(Asset.class))).thenAnswer(inv -> inv.getArgument(0));
		Asset saved = service.add(valid);
		assertEquals("Dell Latitude", saved.getDeviceName());
		verify(repository).save(any(Asset.class));
	}

	@Test
	void findByIdReturnsAsset() {
		Asset asset = new Asset();
		asset.setId(2L);
		when(repository.findById(2L)).thenReturn(Optional.of(asset));
		assertEquals(2L, service.findById(2L).getId());
	}

	@Test
	void missingIdThrows() {
		when(repository.findById(99L)).thenReturn(Optional.empty());
		assertThrows(AssetNotFoundException.class, () -> service.findById(99L));
	}

	@Test
	void updateKeepsExistingId() {
		Asset existing = new Asset();
		existing.setId(4L);
		when(repository.findById(4L)).thenReturn(Optional.of(existing));
		when(repository.save(any(Asset.class))).thenAnswer(inv -> inv.getArgument(0));
		Asset result = service.update(4L, valid);
		assertEquals(4L, result.getId());
		assertEquals("SER-1", result.getSerialNumber());
		verify(repository).save(existing);
	}

	@Test
	void missingRequiredNameIsRejected() {
		var invalid = new AssetRequest(" ", "LAPTOP", "SER-1", "", "GOOD", "2025-02-14", "AVAILABLE");
		assertThrows(com.assetdesk.exception.AssetValidationException.class, () -> service.add(invalid));
		verify(repository, never()).save(any());
	}

	@Test
	void duplicateSerialIsRejected() {
		when(repository.existsBySerialNumberIgnoreCase("SER-1")).thenReturn(true);
		assertThrows(com.assetdesk.exception.AssetValidationException.class, () -> service.add(valid));
		verify(repository, never()).save(any());
	}
}
