
package com.assetdesk.repository;

import com.assetdesk.model.Asset;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface AssetRepository
        extends CrudRepository<Asset, Long>,
                PagingAndSortingRepository<Asset, Long> {

    boolean existsBySerialNumberIgnoreCase(String serialNumber);

    boolean existsBySerialNumberIgnoreCaseAndIdNot(
            String serialNumber, Long id);
}
