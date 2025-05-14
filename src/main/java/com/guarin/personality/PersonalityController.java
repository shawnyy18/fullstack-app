package com.guarin.personality;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guarin/personalities")
@CrossOrigin(origins = "http://localhost:5174") // Updated to match the frontend's origin
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
            for (Personality personality : personalities) {
                if (personality.getDescription().length() > 255) {
                    personality.setDescription(personality.getDescription().substring(0, 255));
                }
            }
            List<Personality> savedPersonalities = repository.saveAll(personalities);
            return new ResponseEntity<>(savedPersonalities, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}