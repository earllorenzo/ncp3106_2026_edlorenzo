document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. OBJECTIVES & SCHOLARSHIPS TAB SWITCHER & SCROLL SYNC
       ========================================================================== */
    const btnObj = document.getElementById('btnObjectives');
    const btnSch = document.getElementById('btnScholarships');
    const groupObj = document.getElementById('groupObjectives');
    const groupSch = document.getElementById('groupScholarships');
    const mainTitle = document.getElementById('tabMainTitle');
    const subDesc = document.getElementById('tabSubDesc');

    let observer;

    function setupScrollObserver() {
        if (observer) observer.disconnect();

        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -35% 0px',
            threshold: 0.2
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeGroup = entry.target.closest('.tab-content-group');
                    
                    if (activeGroup && activeGroup.classList.contains('active')) {
                        // Clear active states across all items & timeline dots
                        document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
                        document.querySelectorAll('.timeline-dot').forEach(d => d.classList.remove('active'));

                        // Light up active text item
                        entry.target.classList.add('active');

                        // Light up corresponding centered dot
                        const itemIdx = entry.target.getAttribute('data-index');
                        const targetDot = document.getElementById(`dot-${itemIdx}`);
                        if (targetDot) targetDot.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Observe items in the active tab group
        const activeGroup = document.querySelector('.tab-content-group.active');
        if (activeGroup) {
            activeGroup.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
        }
    }

    // Tab Switch Handler
    function switchTab(tab) {
        if (!groupObj || !groupSch) return;

        if (tab === 'objectives') {
            if (btnObj) btnObj.classList.add('active');
            if (btnSch) btnSch.classList.remove('active');

            groupObj.classList.add('active');
            groupSch.classList.remove('active');

            if (mainTitle) mainTitle.innerHTML = 'Program <br><span class="highlight-text">Objectives</span>';
            if (subDesc) subDesc.innerText = 'Discover the key learning outcomes and career objectives designed for Computer Engineering students.';
        } else if (tab === 'scholarships') {
            if (btnSch) btnSch.classList.add('active');
            if (btnObj) btnObj.classList.remove('active');

            groupSch.classList.add('active');
            groupObj.classList.remove('active');

            if (mainTitle) mainTitle.innerHTML = 'Available <br><span class="highlight-text">Scholarships</span>';
            if (subDesc) subDesc.innerText = 'Explore academic grants, financial aid programs, and corporate sponsorships available for CpE majors.';
        }

        // Reset to first item (01) lit up
        const activeGroup = document.querySelector('.tab-content-group.active');
        if (activeGroup) {
            const items = activeGroup.querySelectorAll('.timeline-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === 0);
            });
        }

        document.querySelectorAll('.timeline-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });

        // Re-bind scroll observer
        setupScrollObserver();
    }

    if (btnObj) btnObj.addEventListener('click', () => switchTab('objectives'));
    if (btnSch) btnSch.addEventListener('click', () => switchTab('scholarships'));

    // Initialize observer on page load
    setupScrollObserver();


    /* ==========================================================================
       2. CAREER CAROUSEL & DRAG SLIDER
       ========================================================================== */
    const track = document.getElementById('carouselTrack');
    const cards = document.querySelectorAll('.career-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (track) {
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationId = 0;
        let isClickPrevented = false;

        const getMinTranslate = () => {
            const wrapperWidth = track.parentElement.offsetWidth;
            const trackWidth = track.scrollWidth;
            return Math.min(0, wrapperWidth - trackWidth - 60);
        };

        const getMaxTranslate = () => 0;

        function updateArrowVisibility() {
            const minTranslate = getMinTranslate();
            const maxTranslate = getMaxTranslate();

            if (prevBtn) prevBtn.classList.toggle('disabled', currentTranslate >= maxTranslate - 5);
            if (nextBtn) nextBtn.classList.toggle('disabled', currentTranslate <= minTranslate + 5);
        }

        function setSliderPosition() {
            track.style.transform = `translateX(${currentTranslate}px)`;
            updateArrowVisibility();
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function clampPosition(position) {
            const min = getMinTranslate();
            const max = getMaxTranslate();
            return Math.max(min, Math.min(position, max));
        }

        function touchStart(event) {
            isDragging = true;
            isClickPrevented = false;
            startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            animationId = requestAnimationFrame(animation);
            track.classList.add('grabbing');
        }

        function touchMove(event) {
            if (!isDragging) return;
            const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            const diff = currentPosition - startX;

            if (Math.abs(diff) > 6) isClickPrevented = true;

            currentTranslate = clampPosition(prevTranslate + diff);
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationId);
            prevTranslate = currentTranslate;
            track.classList.remove('grabbing');
            setSliderPosition();
        }

        track.addEventListener('mousedown', touchStart);
        window.addEventListener('mousemove', touchMove);
        window.addEventListener('mouseup', touchEnd);

        track.addEventListener('touchstart', touchStart);
        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', touchEnd);

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                currentTranslate = clampPosition(currentTranslate - 384);
                prevTranslate = currentTranslate;
                setSliderPosition();
            });

            prevBtn.addEventListener('click', () => {
                currentTranslate = clampPosition(currentTranslate + 384);
                prevTranslate = currentTranslate;
                setSliderPosition();
            });
        }

        window.addEventListener('resize', () => {
            currentTranslate = clampPosition(currentTranslate);
            prevTranslate = currentTranslate;
            setSliderPosition();
        });

        updateArrowVisibility();

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (isClickPrevented) return;

                const isAlreadyExpanded = card.classList.contains('expanded');
                cards.forEach(c => c.classList.remove('expanded'));

                if (!isAlreadyExpanded) {
                    card.classList.add('expanded');
                    track.classList.add('has-expanded');
                } else {
                    track.classList.remove('has-expanded');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.career-card') && !e.target.closest('.carousel-arrow')) {
                cards.forEach(c => c.classList.remove('expanded'));
                track.classList.remove('has-expanded');
            }
        });
    }


    /* ==========================================================================
       3. MODALS (IMAGE LIGHTBOX, VIDEO, GALLERY)
       ========================================================================== */
    // Image Lightbox
    const lightboxModalElement = document.getElementById("imageLightboxModal");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");

    if (lightboxModalElement && lightboxImage) {
        const imageModal = new bootstrap.Modal(lightboxModalElement);
        document.querySelectorAll(".clickable-image").forEach((img) => {
            img.addEventListener("click", () => {
                lightboxImage.src = img.getAttribute("data-full-img") || img.src;
                if (lightboxCaption) lightboxCaption.textContent = img.alt || "";
                imageModal.show();
            });
        });
    }

    // Video Modal
    const videoModalEl = document.getElementById('cpeVideoModal');
    const videoPlayer = document.getElementById('mainVideoPlayer');

    if (videoModalEl && videoPlayer) {
        const videoModal = new bootstrap.Modal(videoModalEl);

        document.querySelectorAll('.video-card').forEach((card) => {
            card.addEventListener('click', () => {
                const videoSrc = card.getAttribute('data-video-src');
                if (videoSrc) {
                    videoPlayer.src = videoSrc;
                    videoPlayer.controls = true;
                    videoPlayer.load();
                    videoModal.show();
                    videoPlayer.play();
                }
            });
        });

        videoModalEl.addEventListener('hidden.bs.modal', () => {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.src = '';
        });
    }

    // Gallery Lightbox
    const galleryModalEl = document.getElementById("galleryLightboxModal");
    const modalFullImage = document.getElementById("modalFullImage");

    if (galleryModalEl && modalFullImage) {
        const galleryModal = new bootstrap.Modal(galleryModalEl);

        document.querySelectorAll(".gallery-clickable-img").forEach((img) => {
            img.addEventListener("click", () => {
                modalFullImage.src = img.getAttribute("data-full-img") || img.src;
                galleryModal.show();
            });
        });
    }

});

/* ==========================================================================
   BACKGROUND IMAGE FADE SLIDESHOW
   ========================================================================== */
let currentBgIndex = 0;
let bgInterval;

function showBgSlide(index) {
    const slides = document.querySelectorAll('.bg-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (!slides.length) return;

    // Normalize index wrap-around
    if (index >= slides.length) currentBgIndex = 0;
    else if (index < 0) currentBgIndex = slides.length - 1;
    else currentBgIndex = index;

    // Toggle active state for images & dots
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentBgIndex);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentBgIndex);
    });
}

function goToBgSlide(index) {
    showBgSlide(index);
    resetBgTimer();
}

function startBgSlideshow() {
    bgInterval = setInterval(() => {
        showBgSlide(currentBgIndex + 1);
    }, 5000); // Transitions background every 5 seconds
}

function resetBgTimer() {
    clearInterval(bgInterval);
    startBgSlideshow();
}

// Start on document load
document.addEventListener('DOMContentLoaded', () => {
    startBgSlideshow();
d});