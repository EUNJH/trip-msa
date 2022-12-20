package com.nearspot.nearspot.controller;

import com.nearspot.nearspot.dto.NearDto;
import com.nearspot.nearspot.service.NearService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

@RequiredArgsConstructor
@RestController
public class NearController {

    private final NearService nearService;

    @GetMapping("/nearspots")
    public String getNearPlace(@RequestParam String lat, @RequestParam String lng) {
        return nearService.getNearPlace(lat, lng);
    }

    @GetMapping("/nearspots/{contentId}")
    public String getNearDetailIntro(@PathVariable Long contentId) {
        return nearService.getNearDetailIntro(contentId);
    }

    @PostMapping("/nearspots")
    public String getNearPlaceList(@RequestBody NearDto nearDto) {
        return nearService.getNearPlaceList(nearDto);
    }

    @GetMapping("/nearspots/image")
    public Resource getDefaultImage() throws MalformedURLException {
        return new UrlResource("file:/default.png");
    }

    @GetMapping("/nearspots/marker")
    public Resource getMarkerImage() throws MalformedURLException {
        return new UrlResource("file:/marker.png");
    }

}
