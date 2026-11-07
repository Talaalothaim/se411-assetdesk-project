
package com.assetdesk.exception;

public class AssetNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AssetNotFoundException(Long id) {
        super("No asset with ID " + id + ".");
    }
}
