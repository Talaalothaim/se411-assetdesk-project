package com.assetdesk.dto;

import com.assetdesk.model.Asset;
import java.util.List;
import java.util.Map;

public record AssetStats(long total, long available, long assigned, long inRepair, Map<String, Long> byType,
		List<Asset> needsAttention) {
}
