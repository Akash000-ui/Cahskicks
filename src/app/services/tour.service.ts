import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TourService {
    private readonly TOUR_COMPLETED_KEY = 'seeder_tour_completed';
    private readonly TOUR_SKIPPED_KEY = 'seeder_tour_skipped';

    private tourActiveSubject = new BehaviorSubject<boolean>(false);
    public tourActive$ = this.tourActiveSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    /**
     * Check if user has completed or skipped the tour
     */
    shouldShowTour(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false; // Don't show tour on server side
        }

        const completed = localStorage.getItem(this.TOUR_COMPLETED_KEY);
        const skipped = localStorage.getItem(this.TOUR_SKIPPED_KEY);
        return !completed && !skipped;
    }

    /**
     * Check if this is a first-time user
     */
    isFirstTimeUser(): boolean {
        return this.shouldShowTour();
    }

    /**
     * Start the tour
     */
    startTour(): void {
        this.tourActiveSubject.next(true);
    }

    /**
     * Mark tour as completed
     */
    completeTour(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOUR_COMPLETED_KEY, 'true');
        }
        this.tourActiveSubject.next(false);
    }

    /**
     * Mark tour as skipped
     */
    skipTour(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOUR_SKIPPED_KEY, 'true');
        }
        this.tourActiveSubject.next(false);
    }

    /**
     * Reset tour status (for testing/demo purposes)
     */
    resetTour(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOUR_COMPLETED_KEY);
            localStorage.removeItem(this.TOUR_SKIPPED_KEY);
        }
        this.tourActiveSubject.next(false);
    }

    /**
     * Force show tour (for help menu)
     */
    showTourAgain(): void {
        this.tourActiveSubject.next(true);
    }
}
