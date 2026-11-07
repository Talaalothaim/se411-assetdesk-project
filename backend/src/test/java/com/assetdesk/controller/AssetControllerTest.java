package com.assetdesk.controller;

import com.assetdesk.dto.AssetPageResponse;
import com.assetdesk.model.Asset;
import com.assetdesk.service.AssetService;
import com.assetdesk.exception.ApiExceptionHandler;
import com.assetdesk.exception.AssetNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AssetControllerTest {
	AssetService service;
	MockMvc mvc;

	@BeforeEach
	void setup() {
		service = mock(AssetService.class);
		mvc = MockMvcBuilders.standaloneSetup(new AssetController(service))
				.setControllerAdvice(new ApiExceptionHandler()).build();
	}

	@Test
	void listReturnsPaginatedResponse() throws Exception {
		when(service.findAll(0, 5, null, null, null, null)).thenReturn(new AssetPageResponse(List.of(), 0, 5, 0, 0));
		mvc.perform(get("/api/assets")).andExpect(status().isOk()).andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.content").isArray());
	}

	@Test
	void missingAssetReturns404() throws Exception {
		when(service.findById(99L)).thenThrow(new AssetNotFoundException(99L));
		mvc.perform(get("/api/assets/99")).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("No asset with ID 99."));
	}

	@Test
	void postCreatesAsset() throws Exception {
		Asset result = new Asset();
		result.setId(15L);
		when(service.add(any())).thenReturn(result);
		mvc.perform(
				post("/api/assets").contentType(MediaType.APPLICATION_JSON).content("{\"deviceName\":\"New laptop\"}"))
				.andExpect(status().isCreated()).andExpect(jsonPath("$.id").value(15));
	}

	@Test
	void putCallsUpdate() throws Exception {
		Asset result = new Asset();
		result.setId(7L);
		when(service.update(eq(7L), any())).thenReturn(result);
		mvc.perform(
				put("/api/assets/7").contentType(MediaType.APPLICATION_JSON).content("{\"deviceName\":\"Updated\"}"))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(7));
	}
}
