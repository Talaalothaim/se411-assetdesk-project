package com.assetdesk;

import com.assetdesk.dto.AssetRequest;
import com.assetdesk.repository.AssetRepository;
import com.assetdesk.service.AssetService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SampleData {
	@Bean
	CommandLineRunner seed(AssetRepository repository, AssetService service) {
		return args -> {
			if (repository.count() != 0)
				return;
			service.add(new AssetRequest("Dell Latitude 7440", "LAPTOP", "DL7440-8F2K19", "Reem Alshehri", "GOOD",
					"2025-02-14", "ASSIGNED"));
			service.add(new AssetRequest("MacBook Pro 14 M3", "LAPTOP", "C02XK9MLD6", "Omar Alzahrani", "NEW",
					"2026-01-08", "ASSIGNED"));
			service.add(new AssetRequest("Lenovo ThinkPad X1 Carbon", "LAPTOP", "PF3Z7Q21", "", "GOOD", "2024-09-30",
					"AVAILABLE"));
			service.add(new AssetRequest("Dell UltraSharp U2723QE", "MONITOR", "CN0U27Q-4471", "Lama Alotaibi", "GOOD",
					"2024-11-02", "ASSIGNED"));
			service.add(new AssetRequest("LG UltraFine 27UN880", "MONITOR", "211NTKF3H908", "", "FAIR", "2023-06-19",
					"AVAILABLE"));
			service.add(new AssetRequest("HP EliteDesk 800 G9", "DESKTOP", "8CC3201XQZ", "Khalid Alghamdi", "GOOD",
					"2024-03-11", "ASSIGNED"));
			service.add(new AssetRequest("HP EliteBook 840 G10", "LAPTOP", "5CG4142T7M", "", "DAMAGED", "2023-10-05",
					"IN_REPAIR"));
			service.add(new AssetRequest("Logitech MX Keys S", "ACCESSORY", "2214LZ0A8K1", "Hessa Aldosari", "NEW",
					"2026-03-22", "ASSIGNED"));
			service.add(new AssetRequest("Apple Studio Display", "MONITOR", "H4TJ29P1Q6", "", "NEW", "2026-05-03",
					"AVAILABLE"));
			service.add(new AssetRequest("Dell OptiPlex 7010", "DESKTOP", "9QX7KZ3", "Abdullah Alharbi", "GOOD",
					"2025-08-17", "ASSIGNED"));
			service.add(new AssetRequest("Samsung Odyssey G7", "MONITOR", "0B7RHNAW300412", "", "GOOD", "2025-04-29",
					"AVAILABLE"));
			service.add(new AssetRequest("Jabra Evolve2 65 Headset", "ACCESSORY", "JB65-2207-118", "", "FAIR",
					"2024-06-12", "IN_REPAIR"));
		};
	}
}
