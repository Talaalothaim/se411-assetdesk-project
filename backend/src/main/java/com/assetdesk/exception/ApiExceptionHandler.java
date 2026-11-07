package com.assetdesk.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(AssetNotFoundException.class)
	public ResponseEntity<Map<String, Object>> notFound(AssetNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(Map.of("message", ex.getMessage(), "fieldErrors", Map.of()));
	}

	@ExceptionHandler(AssetValidationException.class)
	public ResponseEntity<Map<String, Object>> validation(AssetValidationException ex) {
		return ResponseEntity.status(ex.getStatus())
				.body(Map.of("message", ex.getMessage(), "fieldErrors", ex.getFieldErrors()));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, Object>> malformed(HttpMessageNotReadableException ex) {
		return ResponseEntity.badRequest().body(Map.of("message", "Malformed JSON request.", "fieldErrors", Map.of()));
	}
}
