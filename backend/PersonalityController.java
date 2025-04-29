package com.guarin.personality;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guarin/personalities")
@CrossOrigin(origins = "http://localhost:5173")
public class PersonalityController {

    @Autowired
    private PersonalityRepository repository;

    // GET all personalities
    @GetMapping
    public List<Personality> getAll() {
        return repository.findAll();
    }

    // POST single personality
    @PostMapping
    public Personality create(@RequestBody Personality personality) {
        return repository.save(personality);
    }

    // POST bulk personalities
    @PostMapping("/bulk")
    public ResponseEntity<List<Personality>> bulkUpload(@RequestBody List<Personality> personalities) {
        try {
            // Optional: Add validation logic here, e.g., ensure description length
            for (Personality personality : personalities) {
                if (personality.getDescription().length() > 255) {
                    personality.setDescription(personality.getDescription().substring(0, 255)); // Truncate or handle error
                }
            }
            // Bulk save the list of personalities
            List<Personality> savedPersonalities = repository.saveAll(personalities);
            return new ResponseEntity<>(savedPersonalities, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            // Handle case where data is too large or violates constraints
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}
