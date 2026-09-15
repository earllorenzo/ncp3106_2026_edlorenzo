document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const cards = document.querySelectorAll('.career-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;
    let isClickPrevented = false;

    // Calculate maximum drag boundaries dynamically based on total track width
    const getMinTranslate = () => {
        const wrapperWidth = track.parentElement.offsetWidth;
        const trackWidth = track.scrollWidth;
        return Math.min(0, wrapperWidth - trackWidth - 60);
    };

    const getMaxTranslate = () => 0;

    // Fade out navigation arrows when hitting track boundaries
    function updateArrowVisibility() {
        const minTranslate = getMinTranslate();
        const maxTranslate = getMaxTranslate();

        if (prevBtn) {
            if (currentTranslate >= maxTranslate - 5) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }

        if (nextBtn) {
            if (currentTranslate <= minTranslate + 5) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
    }

    // Apply continuous position update
    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
        updateArrowVisibility();
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    // Keep cards pinned within container bounds on release
    function clampPosition(position) {
        const min = getMinTranslate();
        const max = getMaxTranslate();
        return Math.max(min, Math.min(position, max));
    }

    // Drag Handlers (Mouse & Touch)
    function touchStart(event) {
        isDragging = true;
        isClickPrevented = false;
        startX = getPositionX(event);
        animationId = requestAnimationFrame(animation);
        track.classList.add('grabbing');
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startX;
        
        if (Math.abs(diff) > 6) {
            isClickPrevented = true; // Prevent click-to-expand during active drag
        }

        currentTranslate = clampPosition(prevTranslate + diff);
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationId);
        prevTranslate = currentTranslate; // Locks updated position permanently
        track.classList.remove('grabbing');
        setSliderPosition();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    }

    // Drag Event Listeners
    track.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);

    track.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);

    // Arrow Controls (Step by 384px: 360px card width + 24px gap)
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

    // Window Resize Boundary Check
    window.addEventListener('resize', () => {
        currentTranslate = clampPosition(currentTranslate);
        prevTranslate = currentTranslate;
        setSliderPosition();
    });

    // Initial boundary check
    updateArrowVisibility();

    // Dramatic Spring Pop-out Expansion Trigger
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (isClickPrevented) return;

            const isAlreadyExpanded = card.classList.contains('expanded');
            cards.forEach(c => c.classList.remove('expanded'));

            if (!isAlreadyExpanded) {
                card.classList.add('expanded');
                track.classList.add('has-expanded'); // Dims inactive cards
            } else {
                track.classList.remove('has-expanded'); // Restores all cards
            }
        });
    });

    // Close expansion when clicking anywhere outside of a card
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.career-card') && !e.target.closest('.carousel-arrow')) {
            cards.forEach(c => c.classList.remove('expanded'));
            track.classList.remove('has-expanded');
        }
    });
});