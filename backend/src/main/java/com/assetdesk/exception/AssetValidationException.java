
package com.assetdesk.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;

public class AssetValidationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final HttpStatus status;
    private final Map<String, String> fieldErrors;

    public AssetValidationException(
            HttpStatus status,
            String message,
            Map<String, String> fieldErrors) {

        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
