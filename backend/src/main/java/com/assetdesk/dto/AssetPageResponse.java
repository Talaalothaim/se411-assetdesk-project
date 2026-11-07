package com.assetdesk.dto;

import com.assetdesk.model.Asset;
import java.util.List;
import org.springframework.data.domain.Page;

public record AssetPageResponse(List<Asset> content, int page, int size, long totalElements, int totalPages) {
	public static AssetPageResponse from(Page<Asset> p) {
		return new AssetPageResponse(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(),
				p.getTotalPages());
	}
}
