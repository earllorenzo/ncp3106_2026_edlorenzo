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
                        document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
                        document.querySelectorAll('.timeline-dot').forEach(d => d.classList.remove('active'));

                        entry.target.classList.add('active');

                        const itemIdx = entry.target.getAttribute('data-index');
                        const targetDot = document.getElementById(`dot-${itemIdx}`);
                        if (targetDot) targetDot.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        const activeGroup = document.querySelector('.tab-content-group.active');
        if (activeGroup) {
            activeGroup.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
        }
    }

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

        setupScrollObserver();
    }

    if (btnObj) btnObj.addEventListener('click', () => switchTab('objectives'));
    if (btnSch) btnSch.addEventListener('click', () => switchTab('scholarships'));

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

            if (Math.abs(diff) > 10) isClickPrevented = true;

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
       3. MODALS (IMAGE LIGHTBOX & GOOGLE DRIVE VIDEO LIGHTBOX)
       ========================================================================== */
    const lightboxModalElement = document.getElementById("imageLightboxModal");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");

    if (lightboxModalElement && lightboxImage) {
        const imageModal = bootstrap.Modal.getOrCreateInstance(lightboxModalElement);
        
        document.querySelectorAll(".clickable-image, .gallery-clickable-img").forEach((img) => {
            img.addEventListener("click", () => {
                const fullImgSrc = img.getAttribute("data-full-img") || img.src;
                if (!fullImgSrc) return;

                lightboxImage.src = fullImgSrc;
                if (lightboxCaption) {
                    lightboxCaption.textContent = img.alt || "";
                }
                imageModal.show();
            });
        });

        lightboxModalElement.addEventListener("hidden.bs.modal", () => {
            lightboxImage.src = "";
            if (lightboxCaption) {
                lightboxCaption.textContent = "";
            }
        });
    }

const videoModalElement = document.getElementById("cpeVideoModal");
    const drivePlayer = document.getElementById("mainDrivePlayer");

    if (videoModalElement && drivePlayer) {
        const videoModal = bootstrap.Modal.getOrCreateInstance(videoModalElement);

        document.querySelectorAll(".video-card[data-drive-src]").forEach((card) => {
            card.addEventListener("click", () => {
                const driveUrl = card.getAttribute("data-drive-src");
                if (driveUrl) {
                    drivePlayer.setAttribute("src", driveUrl);
                    videoModal.show();
                }
            });
        });

        videoModalElement.addEventListener("hidden.bs.modal", () => {
            drivePlayer.setAttribute("src", "");
        });
    }


    /* ==========================================================================
       4. BACKGROUND IMAGE FADE SLIDESHOW
       ========================================================================== */
    let currentBgIndex = 0;
    let bgInterval;

    function showBgSlide(index) {
        const slides = document.querySelectorAll('.bg-slide');
        const dots = document.querySelectorAll('.hero-dot');

        if (!slides.length) return;

        if (index >= slides.length) currentBgIndex = 0;
        else if (index < 0) currentBgIndex = slides.length - 1;
        else currentBgIndex = index;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentBgIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentBgIndex);
        });
    }

    function startBgSlideshow() {
        if (!document.querySelectorAll('.bg-slide').length) return;
        bgInterval = setInterval(() => {
            showBgSlide(currentBgIndex + 1);
        }, 5000);
    }

    startBgSlideshow();


    /* ==========================================================================
       5. ISOLATED FACULTY CAROUSEL & DRAG SLIDER
       ========================================================================== */
    const facultyTrack = document.getElementById('facultyCarouselTrack');
    const facultyCards = facultyTrack ? facultyTrack.querySelectorAll('.faculty-card') : [];
    const facultyPrevBtn = document.getElementById('facultyPrevBtn');
    const facultyNextBtn = document.getElementById('facultyNextBtn');

    if (facultyTrack) {
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationId = 0;
        let isClickPrevented = false;

        const getMinTranslate = () => {
            const wrapperWidth = facultyTrack.parentElement.offsetWidth;
            const trackWidth = facultyTrack.scrollWidth;
            return Math.min(0, wrapperWidth - trackWidth - 60);
        };

        const getMaxTranslate = () => 0;

        function updateArrowVisibility() {
            const minTranslate = getMinTranslate();
            const maxTranslate = getMaxTranslate();

            if (facultyPrevBtn) facultyPrevBtn.classList.toggle('disabled', currentTranslate >= maxTranslate - 5);
            if (facultyNextBtn) facultyNextBtn.classList.toggle('disabled', currentTranslate <= minTranslate + 5);
        }

        function setSliderPosition() {
            facultyTrack.style.transform = `translateX(${currentTranslate}px)`;
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
            facultyTrack.classList.add('grabbing');
        }

        function touchMove(event) {
            if (!isDragging) return;
            const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            const diff = currentPosition - startX;

            if (Math.abs(diff) > 10) isClickPrevented = true;

            currentTranslate = clampPosition(prevTranslate + diff);
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationId);
            prevTranslate = currentTranslate;
            facultyTrack.classList.remove('grabbing');
            setSliderPosition();
        }

        facultyTrack.addEventListener('mousedown', touchStart);
        window.addEventListener('mousemove', touchMove);
        window.addEventListener('mouseup', touchEnd);

        facultyTrack.addEventListener('touchstart', touchStart);
        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', touchEnd);

        if (facultyNextBtn && facultyPrevBtn) {
            facultyNextBtn.addEventListener('click', () => {
                currentTranslate = clampPosition(currentTranslate - 384);
                prevTranslate = currentTranslate;
                setSliderPosition();
            });

            facultyPrevBtn.addEventListener('click', () => {
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

        facultyCards.forEach(card => {
            card.addEventListener('click', () => {
                if (isClickPrevented) return;

                const isAlreadyExpanded = card.classList.contains('expanded');
                facultyCards.forEach(c => c.classList.remove('expanded'));

                if (!isAlreadyExpanded) {
                    card.classList.add('expanded');
                    facultyTrack.classList.add('has-expanded');
                } else {
                    facultyTrack.classList.remove('has-expanded');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.faculty-card') && !e.target.closest('.carousel-arrow')) {
                facultyCards.forEach(c => c.classList.remove('expanded'));
                facultyTrack.classList.remove('has-expanded');
            }
        });
    }


    /* ==========================================================================
       6. EXECUTIVES DRAGGABLE CAROUSEL & EXPANSION SCRIPT
       ========================================================================== */
    const execTrack = document.getElementById('execCarouselTrack');
    const execCards = execTrack ? execTrack.querySelectorAll('.executive-card') : [];
    const execPrevBtn = document.getElementById('execPrevBtn');
    const execNextBtn = document.getElementById('execNextBtn');

    if (execTrack) {
        let isDraggingExec = false;
        let startXExec = 0;
        let currentTranslateExec = 0;
        let prevTranslateExec = 0;
        let animationIdExec = 0;
        let isClickPreventedExec = false;

        const getMinTranslateExec = () => {
            const wrapperWidth = execTrack.parentElement.offsetWidth;
            const trackWidth = execTrack.scrollWidth;
            return Math.min(0, wrapperWidth - trackWidth - 60);
        };

        const getMaxTranslateExec = () => 0;

        function updateExecArrowVisibility() {
            const minTranslate = getMinTranslateExec();
            const maxTranslate = getMaxTranslateExec();

            if (execPrevBtn) execPrevBtn.classList.toggle('disabled', currentTranslateExec >= maxTranslate - 5);
            if (execNextBtn) execNextBtn.classList.toggle('disabled', currentTranslateExec <= minTranslate + 5);
        }

        function setExecSliderPosition() {
            execTrack.style.transform = `translateX(${currentTranslateExec}px)`;
            updateExecArrowVisibility();
        }

        function animationExec() {
            setExecSliderPosition();
            if (isDraggingExec) requestAnimationFrame(animationExec);
        }

        function clampPositionExec(position) {
            const min = getMinTranslateExec();
            const max = getMaxTranslateExec();
            return Math.max(min, Math.min(position, max));
        }

        function execTouchStart(event) {
            isDraggingExec = true;
            isClickPreventedExec = false;
            startXExec = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            animationIdExec = requestAnimationFrame(animationExec);
            execTrack.classList.add('grabbing');
        }

        function execTouchMove(event) {
            if (!isDraggingExec) return;
            const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            const diff = currentPosition - startXExec;

            if (Math.abs(diff) > 10) isClickPreventedExec = true;

            currentTranslateExec = clampPositionExec(prevTranslateExec + diff);
        }

        function execTouchEnd() {
            if (!isDraggingExec) return;
            isDraggingExec = false;
            cancelAnimationFrame(animationIdExec);
            prevTranslateExec = currentTranslateExec;
            execTrack.classList.remove('grabbing');
            setExecSliderPosition();
        }

        execTrack.addEventListener('mousedown', execTouchStart);
        window.addEventListener('mousemove', execTouchMove);
        window.addEventListener('mouseup', execTouchEnd);

        execTrack.addEventListener('touchstart', execTouchStart);
        window.addEventListener('touchmove', execTouchMove);
        window.addEventListener('touchend', execTouchEnd);

        if (execNextBtn && execPrevBtn) {
            execNextBtn.addEventListener('click', () => {
                currentTranslateExec = clampPositionExec(currentTranslateExec - 384);
                prevTranslateExec = currentTranslateExec;
                setExecSliderPosition();
            });

            execPrevBtn.addEventListener('click', () => {
                currentTranslateExec = clampPositionExec(currentTranslateExec + 384);
                prevTranslateExec = currentTranslateExec;
                setExecSliderPosition();
            });
        }

        window.addEventListener('resize', () => {
            currentTranslateExec = clampPositionExec(currentTranslateExec);
            prevTranslateExec = currentTranslateExec;
            setExecSliderPosition();
        });

        updateExecArrowVisibility();

        execCards.forEach(card => {
            card.addEventListener('click', () => {
                if (isClickPreventedExec) return;

                const isAlreadyExpanded = card.classList.contains('expanded');
                execCards.forEach(c => c.classList.remove('expanded'));

                if (!isAlreadyExpanded) {
                    card.classList.add('expanded');
                    execTrack.classList.add('has-expanded');
                } else {
                    execTrack.classList.remove('has-expanded');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.executive-card') && !e.target.closest('.carousel-arrow') && !e.target.closest('#execPrevBtn') && !e.target.closest('#execNextBtn')) {
                execCards.forEach(c => c.classList.remove('expanded'));
                execTrack.classList.remove('has-expanded');
            }
        });
    }

});