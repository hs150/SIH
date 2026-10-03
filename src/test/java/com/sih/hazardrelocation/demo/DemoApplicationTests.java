package com.sih.hazardrelocation.demo;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DemoApplicationTests {

	@Test
	void testPasswordMatches() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		assertTrue(encoder.matches("Admin@123", "$2a$10$o7Q3SOdj4LHmrnMvlvzAVOBLtoVqhfjfCu139DmM153A8zk/3t91W"));
	}

}

